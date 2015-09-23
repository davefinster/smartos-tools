var assert = require('assert-plus');

exports.nIndexOf = function(sourceString, searchTerm, n){
	assert.string(sourceString, 'source string');
	assert.string(searchTerm, 'search term');
	assert.number(n, 'n index');
	var count = 0;
	var currentSource = sourceString;
	var nIndex = 0;
	while(count < n){
		var nextOccurance = currentSource.indexOf(searchTerm);
		if ( nextOccurance == -1 ){
			return -1;
		}
		if ( count != (n - 1) ){
			nextOccurance += 1;
		}
		nIndex += nextOccurance;
		currentSource = currentSource.substring(nextOccurance, currentSource.length);
		count += 1;
	}
	return nIndex;
}

exports.substringToNIndex = function(sourceString, searchTerm, n){
	assert.string(sourceString, 'source string');
	assert.string(searchTerm, 'search term');
	assert.number(n, 'n index');
	var index = exports.nIndexOf(sourceString, searchTerm, n);
	if ( index == -1 ){
		return sourceString.substring(0, sourceString.length);
	}else{
		return sourceString.substring(0, index);
	}
}

exports.trimSplitZfsOutput = function(output){
	assert.string(output, 'output');
	var lines = output.split('\n');
	var cleanLines = [];
	for ( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		if ( line.length == 0 ){
			continue;
		}
		var splitLine = line.trim().split(' ');
		var cleanSplitLine = [];
		for ( var j = 0; j < splitLine.length; j++ ){
			var part = splitLine[j];
			if ( part.length > 0 ){
				cleanSplitLine.push(part);
			}
		}
		cleanLines.push(cleanSplitLine);
	}
	return cleanLines;
}
