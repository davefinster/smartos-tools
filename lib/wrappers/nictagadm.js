var assert = require('assert-plus');
var debug = require('debug')('smartos:nictagadm');
var common = require('../common');
var fieldLayout = ['name', 'macAddress', 'interface', 'type'];

function Nictagadm(endpoint){
	this.endpoint = endpoint;
}

Nictagadm.parseNictagadmLine = function(line){
	//general format is <name>:<mac or '-''>:<type (availablity varies)>
	assert.string(line);
	var tag = {
		name: null,
		macAddress: null,
		interface: null,
		type: null
	};
	var sourceLine = line;
	for ( var i = 0; i < fieldLayout.length; i++ ){
		var fieldName = fieldLayout[i];
		var delimCount = 1;
		if (( fieldName == 'macAddress' ) && ( sourceLine[0] != '-' )){
			delimCount = 6;
		}
		var substringIndex = common.nIndexOf(sourceLine, ':', delimCount);
		var substring = null;
		if (substringIndex == -1){
			substring = sourceLine;
		}else{
			substring = sourceLine.substring(0, substringIndex);
		}
		if ((substring != null) && ( substring.length > 0 ) && ( substring != '-')){
			tag[fieldName] = substring;
		}
		if (substringIndex == -1){
			sourceLine = '';
		}else{
			sourceLine = sourceLine.substring(substringIndex + 1, sourceLine.length);
		}
	}
	return tag;
}

Nictagadm.parseNictagadmOutput = function(output){
	assert.string(output);
	var lines = output.split('\n');
	var tags = [];
	for ( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		if (( line != null ) && ( line.length > 0 )){
			var tag = Nictagadm.parseNictagadmLine(line);
			tags.push(tag);
		}
	}
	return tags;
}

Nictagadm.prototype.list = function(cb){
	//check that the requested fields are all listable
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'nictagadm list -p';
	debug('spawning child with ', execCmd);
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		debug('child execution complete');
		if ( error != null ){
			callback(returnError, null);
			return
		}
		var parsed = Nictagadm.parseNictagadmOutput(stdout);
		callback(null, parsed);
	});
}

module.exports = Nictagadm;