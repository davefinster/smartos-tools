var assert = require('assert-plus');
var debug = require('debug')('smartos:sysinfo:processor');

function Sysinfo(endpoint){
	this.endpoint = endpoint;
}

Sysinfo.prototype.fetch = function(cb){
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'sysinfo';
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			callback(error, null);
			return;
		}
		var returnObj = JSON.parse(stdout);
		callback(null, returnObj);
	});
}

module.exports = Sysinfo;