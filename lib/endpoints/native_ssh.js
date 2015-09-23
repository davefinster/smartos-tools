var exec = require('child_process').exec;
var assert = require('assert-plus');

function NativeSshEndpoint(options){
	assert.object(options, 'options');
	this.host = options.host;
	this.username = options.username;
	this.port = (options.port == null ? 22 : options.port);
	this.identityFilePath = options.identityFilePath;
	this.sshConfigOverrides = (options.sshConfigOverrides == null ? [] : options.sshConfigOverrides);
	this.sshArguments = (options.sshArguments == null ? [] : options.sshArguments);
}

NativeSshEndpoint.prototype.exec = function(command, callback){
	var sshCmd = 'ssh ';
	for ( var i = 0; i < this.sshConfigOverrides.length; i++ ){
		sshCmd += ' -o ' + this.sshConfigOverrides[i] + ' ';
	}
	for ( var i = 0; i < this.sshArguments.length; i++ ){
		sshCmd += ' ' + this.sshArguments[i] + ' ';
	}
	if ( this.identityFilePath ){
		sshCmd += ' -i ' + this.identityFilePath + ' ';
	}
	if ( this.username != null ){
		sshCmd += this.username + '@';
	}
	sshCmd += this.host + ' -p ' + this.port.toString();
	sshCmd += ' ' + command;
	this.child = exec(sshCmd, callback);
}

module.exports = NativeSshEndpoint;
