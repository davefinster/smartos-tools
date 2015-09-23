var assert = require('assert-plus');
var debug = require('debug')('smartos:zpool:processor');
var validVdev = ['cache', 'log', 'spare', 'raidz', 'mirror', 'file', 'disk'];
var common = require('../common');

function Zpool(endpoint){
	this.endpoint = endpoint;
}

Zpool.separatePools = function(lines){
	//a pool starts with 'zones':'<name>' and finish with 'errors:'
	var pools = [];
	var currentPoolLines = null;
	for ( var i = 0; i < lines.length; i++){
		var line = lines[i];
		if (line[0] == 'pool:'){
			//new pool
			if ( currentPoolLines != null ){
				pools.push(currentPoolLines);
			}
			currentPoolLines = [];
		}
		currentPoolLines.push(line);
		if ( line[0] == 'errors:' ){
			//done
			pools.push(currentPoolLines);
			currentPoolLines = null;
		}
	}
	return pools;
}

Zpool.isSectionName = function(name){
	for ( var i = 0; i < validVdev.length; i++ ){
		if ( name.indexOf(validVdev[i]) != -1 ){
			return validVdev[i];
		}
	}
	return null;
}

Zpool.parsevDevs = function(section, headings){
	var vdevs = [];
	var currentvDev = null;
	for ( var i = 0; i < section.length; i++ ){
		var line = section[i];
		var vdevMatch = Zpool.isSectionName(line[0]);
		if ( vdevMatch == null ){
			//its an actual device
			var device = {
				name: line[0],
				type: 'disk'
			}
			for ( var j = 0; j < headings.length; j++ ){
				var heading = headings[j].toLowerCase();
				if (( heading == 'read' ) || ( heading == 'write' )
				|| ( heading == 'cksum')){
					var intValue = parseInt(line[j]);
					if(isNaN(intValue)){
						device[heading] = null;
					}else{
						device[heading] = intValue;
					}
				}else{
					device[heading] = line[j];
				}
			}
			if ( currentvDev != null ){
				currentvDev.devices.push(device);
			}else{
				vdevs.push(device);
			}
		}else{
			if (currentvDev != null){
				vdevs.push(currentvDev);
			}
			currentvDev = {
				devices:[],
				name: line[0],
				type: vdevMatch
			};
			for ( var j = 0; j < headings.length; j++ ){
				var heading = headings[j].toLowerCase();
				if (( heading == 'read' ) || ( heading == 'write' )
				|| ( heading == 'cksum')){
					var intValue = parseInt(line[j]);
					if(isNaN(intValue)){
						currentvDev[heading] = null;
					}else{
						currentvDev[heading] = intValue;
					}
				}else{
					currentvDev[heading] = line[j];
				}
			}
		}
	}
	vdevs.push(currentvDev);
	return vdevs;
}

Zpool.parsePoolLayout = function(layoutData, poolName, headings){
	//layout will consist of multiple sections with the first being
	//the 'disks' and then other sections like logs
	//a section can contain either vdevs or disks
	//start be finding the section boundaries - they will have one entry per line except for the initial section
	var sections = [];
	var currentSection = {
		type: 'data',
		layoutData:[]
	};
	for ( var i = 0; i < layoutData.length; i++){
		var line = layoutData[i];
		if ( line[0] == poolName ){
			//we're in the first section, which does contain some data
			//extract it and move to the next line entry
			for ( var j = 0; j < headings.length; j++ ){
				var heading = headings[j].toLowerCase();
				if (( heading == 'read' ) || ( heading == 'write' )
				|| ( heading == 'cksum')){
					var intValue = parseInt(line[j]);
					if(isNaN(intValue)){
						currentSection[heading] = null;
					}else{
						currentSection[heading] = intValue;
					}
				}else{
					currentSection[heading] = line[j];
				}
			}
			continue;
		}else{
			var sectionMatch = Zpool.isSectionName(line[0]);
			//sections other than the first one will be the only entry on the line
			if (( sectionMatch != null ) && (line.length == 1)){
				//we're in a new section - push the current one
				sections.push(currentSection);
				currentSection = {
					type: sectionMatch,
					name: line[0],
					layoutData:[]
				};
				continue;
			}
		}
		currentSection.layoutData.push(line);
	}
	sections.push(currentSection);
	for ( var i = 0; i < sections.length; i++ ){
		var section = sections[i];
		var vdevs = Zpool.parsevDevs(section.layoutData, headings);
		section.layout = vdevs;
		delete section['layoutData'];
	}
	return sections;
}

Zpool.checkForResilverProgress = function(pool){
	if (( pool.scan != null )
	&& (( pool.scan.indexOf('scanned out of') != -1 )
	|| ( pool.scan.indexOf('scrub in progress') != -1 ))){
		var lines = pool.scan.split('\n');
		if ( lines.length == 3 ){
			//structure is
			//in progress line
			//X scanned out of Y at Z, <time> to go
			//<amount> resilvered, <percent> done
			var scanData = {};
			var resilveringOccuring = false;
			var scrubOccuring = false;
			if ( lines[0].indexOf('resilver') != -1 ){
				scanData.activity = 'resilver';
			}
			if ( lines[0].indexOf('resilver in progress') != -1 ){
				scanData.inProgress = true;
			}
			if ( lines[0].indexOf('scrub') != -1 ){
				scanData.activity = 'scrub';
			}
			if ( lines[0].indexOf('scrub in progress') != -1 ){
				scanData.inProgress = true;
			}
			var progressLineParts = lines[1].split(' ');
			var amountLineParts = lines[2].split(' ');
			scanData.scannedData = progressLineParts[0];
			scanData.totalData = progressLineParts[4];
			scanData.scanRate = progressLineParts[6].replace(',', '');
			scanData.estimatedTime = progressLineParts[7];
			if ( scanData.activity == 'resilver' ){
				scanData.resilverAmount = amountLineParts[0];
			}else{
				scanData.repairedAmount = amountLineParts[0];
			}
			scanData.percentage = amountLineParts[2];
			pool.scanData = scanData;
		}
	}
}

Zpool.parsePool = function(poolData){
	if (( poolData == null ) || ( poolData.length == 0 )){
		return null;
	}
	var headerOrder = [];
	var layoutData = [];
	var pool = {};
	var statusDone = false;
	var scanDone = false;
	for ( var i = 0; i < poolData.length; i++ ){
		var line = poolData[i];
		if ( line.length == 0 ){
			continue;
		}
		if (line[0] == 'pool:'){
			line.shift();
			pool.name = line[0];
		}else if (line[0] == 'state:'){
			line.shift();
			pool.state = line.join(' ');
		}else if (line[0] == 'status:'){
			line.shift();
			pool.status = line.join(' ');
			statusDone = true;
		}else if (line[0] == 'scan:'){
			line.shift();
			pool.scan = line.join(' ');
			scanDone = true;
		}else if (line[0] == 'action:'){
			line.shift();
			pool.action = line.join(' ');
		}else if (line[0] == 'config:'){
			line.shift();
			pool.config = line.join(' ');
			scanDone = false;
			statusDone = false;
		}else if (line[0] == 'NAME'){
			//definition of headers
			headerOrder = line;
		}else if ( line[0] == 'errors:' ){
			line.shift();
			pool.errors = line.join(' ');
		}else if(headerOrder.length > 0 ){
			//we've passed the header line, we're into the pool layout
			layoutData.push(line);
		}else{
			if ( statusDone ){
				pool.status += '\n' + line.join(' ');
				statusDone = false;
			}
			if ( scanDone ){
				pool.scan += '\n' + line.join(' ');
			}
		}
	}
	var sections = Zpool.parsePoolLayout(layoutData, pool.name, headerOrder);
	pool.layout = sections;
	Zpool.checkForResilverProgress(pool);
	return pool;
}

Zpool.parseZpoolStatusOutput = function(output){
	assert.string(output, 'output');
	var cleanParts = common.trimSplitZfsOutput(output);
	var pools = Zpool.separatePools(cleanParts);
	var poolObjs = [];
	for ( var i = 0; i < pools.length; i++ ){
		poolObjs.push(Zpool.parsePool(pools[i]));
	}
	return poolObjs;
}

Zpool.parseZpoolListOutput = function(output){
	assert.string(output, 'output');
	var cleanParts = common.trimSplitZfsOutput(output);
	var headings = cleanParts.shift();
	var pools = [];
	for ( var i = 0; i < cleanParts.length; i++ ){
		var pool = {};
		var line = cleanParts[i];
		for ( var j = 0; j < headings.length; j++ ){
			pool[headings[j].toLowerCase()] = line[j];
		}
		pools.push(pool);
	}
	return pools;
}

Zpool.prototype.status = function(cb){
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'zpool status';
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			if ( error.message != null ){
				var firstLine = error.message.split('\n')[0];
				callback(new Error(firstLine), null);
				return;
			}
			callback(error, null);
			return;
		}
		var returnObj = Zpool.parseZpoolStatusOutput(stdout);
		callback(null, returnObj);
	});
}

Zpool.prototype.list = function(cb){
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'zpool list';
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			if ( error.message != null ){
				var firstLine = error.message.split('\n')[0];
				callback(new Error(firstLine), null);
				return;
			}
			callback(error, null);
			return;
		}
		var returnObj = Zpool.parseZpoolListOutput(stdout);
		callback(null, returnObj);
	});
}

module.exports = Zpool;
