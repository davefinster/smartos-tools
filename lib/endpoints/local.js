var exec = require('child_process').exec;

function LocalEndpoint(){
	this.child = null;
}

LocalEndpoint.prototype.exec = function(command, callback){
	this.child = exec(command, callback);
}

module.exports = LocalEndpoint;