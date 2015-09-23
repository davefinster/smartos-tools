var assert = require('assert-plus');
var debug = require('debug')('smartos:zfs:processor');
var common = require('../common');

function Zfs(endpoint){
	this.endpoint = endpoint;
}

Zfs.parseZfsListOutput = function(output){
	assert.string(output, 'output');
	var cleanParts = common.trimSplitZfsOutput(output);
	var headings = cleanParts.shift();
	var entries = [];
	for ( var i = 0; i < cleanParts.length; i++ ){
		var line = cleanParts[i];
		var entry = {};
		for ( var j = 0; j < headings.length; j++ ){
			entry[headings[j].toLowerCase()] = line[j];
		}
		entries.push(entry);
	}
	return entries;
}

Zfs.prototype.list = function(properties, types, sort, cb){
	assert.func(cb, 'callback');
	var prop = 'name,used,avail,refer,mountpoint';
	if ( properties != null ){
		if ( typeof properties == 'object' ){
			prop = prop.join(',');
		}else{
			prop = properties;
		}
	}
	var type = 'filesystem,volume';
	if ( types != null ){
		if ( typeof types == 'object' ){
			type = types.join(',');
		}else{
			type = types;
		}
	}
	var callback = cb;
	var execCmd = 'zfs list -o ' + prop + ' -t ' + type;
	if ( sort != null ){
		if ( sort[0] == '-' ){
			execCmd += ' -S ' + sort.substring(1, sort.length);
		}else if (sort[0] == '+'){
			execCmd += ' -s ' + sort.substring(1, sort.length);
		}else{
			execCmd += ' -s ' + sort;
		}
	}
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
		if ( stderr.length > 0 ){
			var lines = stderr.split('\n');
			if ( lines[0].indexOf('bad property list: invalid property') != -1 ){
				callback(new Error('Command failed: ' + lines[0]), null);
				return;
			}else if ( lines[0].indexOf('invalid type') != -1 ){
				callback(new Error('Command failed: ' + lines[0]), null);
				return;
			}
		}
		var returnObj = Zfs.parseZfsListOutput(stdout);
		callback(null, returnObj);
	});
}

module.exports = Zfs;