var assert = require('assert-plus');
var debug = require('debug')('smartos:imgadm');
var common = require('../common');
function Imgadm(endpoint){
	this.endpoint = endpoint;
}

Imgadm.parseImgadmListOutput = function(output){
	assert.string(output);
	var cleanedOutput = common.trimSplitZfsOutput(output);
	var images = [];
	var headings = cleanedOutput.shift();
	for ( var i = 0; i < cleanedOutput.length; i++ ){
		var line = cleanedOutput[i];
		var image = {};
		for ( var j = 0; j < headings.length; j++ ){
			image[headings[j].toLowerCase()] = line[j];
		}
		images.push(image);
	}
	return images;
}

Imgadm.prototype.list = function(cb){
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'imgadm list';
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			callback(error, null);
			return;
		}
		var images = Imgadm.parseImgadmListOutput(stdout);
		callback(null, images);
	});
}

module.exports = Imgadm;