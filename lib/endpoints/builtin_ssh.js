var exec = require('child_process').exec;
var assert = require('assert-plus');
var Client = require('ssh2').Client;

function BuiltinSshEndpoint(options){
	assert.object(options, 'options');
	this.host = options.host;
	this.username = options.username;
	this.password = options.password;
	this.port = (options.port == null ? 22 : options.port);
	this.privateKey = options.privateKey;
	this.passphrase = options.passphrase;
	this.ssh2Config = (options.ssh2Config == null ? null : options.ssh2Config);
	this.ready = false;
}

BuiltinSshEndpoint.prototype.exec = function(command, callback){
	var configObj = {};
	var cmd = command;
	var cb = callback;
	var stdout = '';
	var stderr = '';
	if ( this.ssh2Config != null ){
		configObj = this.ssh2Config;
	}else{
		configObj = {
			hostname: this.host,
			username: this.username,
			port: this.port
		};
		if ( this.password != null ){
			configObj.password = this.password;
		}else if ( this.privateKey != null ){
			configObj.privateKey = this.privateKey;
			if ( this.passphrase != null ){
				configObj.passphrase = this.passphrase;
			}
		}
	}
	var self = this;
	var conn = new Client();
	conn.on('ready', function(){
		self.ready = true;
		conn.exec(cmd, function(err, stream) {
			if ( err ){
				cb(err, null, null);
				return;
			}
			stream.on('close', function(code, signal) {
				cb(null, stdout, stderr);
				conn.end();
			}).on('data', function(data) {
				stdout += data;
		    }).stderr.on('data', function(data) {
		   		stderr += data;
		    });
		});
	});
	conn.on('error', function(err){
		cb(err, null, null);
	});
	conn.connect(configObj);
}

module.exports = BuiltinSshEndpoint;
