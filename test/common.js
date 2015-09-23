var sinon = require('sinon');
var expect = require('chai').expect;
var common = require('../lib/common');

describe('nIndexOf', function() {

	it('#works with random string', function(done) {
		var testString = 'uasdkfka:asdioufnaoisd:asidufnkjasdnf:asdf:asdf:asdf:asdf:asdf:999';
		var resultOne = common.nIndexOf(testString, ':', 1);
		expect(testString[resultOne]).to.equal(':');
		expect(resultOne).to.equal(8);
		var resultTwo = common.nIndexOf(testString, ':', 2);
		expect(testString[resultTwo]).to.equal(':');
		expect(resultTwo).to.equal(22);
		var resultThree = common.nIndexOf(testString, ':', 3);
		expect(testString[resultThree]).to.equal(':');
		expect(resultThree).to.equal(37);
		var resultFour = common.nIndexOf(testString, ':', 4);
		expect(testString[resultFour]).to.equal(':');
		expect(resultFour).to.equal(42);
		done();
	});

	it('#works when search term appears sequentially string', function(done) {
		var testString = 'uasdk::::::::::8fjka:::::aodfnasdf:::::';
		var resultOne = common.nIndexOf(testString, ':', 1);
		expect(testString[resultOne]).to.equal(':');
		expect(resultOne).to.equal(5);
		var resultTwo = common.nIndexOf(testString, ':', 2);
		expect(testString[resultTwo]).to.equal(':');
		expect(resultTwo).to.equal(6);
		var resultThree = common.nIndexOf(testString, ':', 12);
		expect(testString[resultThree]).to.equal(':');
		expect(resultThree).to.equal(21);
		done();
	});

	it('#works with basic use case', function(done) {
		var testString = '00\:0c\:29\:99\:21\:77:e1000g0:normal';
		var resultOne = common.nIndexOf(testString, ':', 6);
		expect(testString[resultOne]).to.equal(':');
		expect(resultOne).to.equal(17);
		done();
	});

	it('#returns -1 when n is greater than number of occurances', function(done) {
		var testString = '00\:0c\:29\:99\:21\:77:e1000g0:normal';
		var resultOne = common.nIndexOf(testString, ':', 100);
		expect(resultOne).to.equal(-1);
		done();
	});

});

describe('substringToNIndex', function() {

	it('#works with random string', function(done) {
		var testString = 'uasdkfka:asdioufnaoisd:asidufnkjasdnf:asdf:asdf:asdf:asdf:asdf:999';
		var resultOne = common.substringToNIndex(testString, ':', 1);
		var resultTwo = common.substringToNIndex(testString, ':', 2);
		var resultThree = common.substringToNIndex(testString, ':', 3);
		var resultFour = common.substringToNIndex(testString, ':', 4);
		var resultFive = common.substringToNIndex(testString, ':', 5);
		expect(resultOne).to.equal('uasdkfka');
		expect(resultTwo).to.equal('uasdkfka:asdioufnaoisd');
		expect(resultThree).to.equal('uasdkfka:asdioufnaoisd:asidufnkjasdnf');
		expect(resultFour).to.equal('uasdkfka:asdioufnaoisd:asidufnkjasdnf:asdf');
		expect(resultFive).to.equal('uasdkfka:asdioufnaoisd:asidufnkjasdnf:asdf:asdf');
		done();
	});

	it('#works when search term appears sequentially string', function(done) {
		var testString = 'uasdk::::::::::8fjka:::::aodfnasdf:::::';
		var resultOne = common.substringToNIndex(testString, ':', 1);
		expect(resultOne).to.equal('uasdk');
		var resultTwo = common.substringToNIndex(testString, ':', 2);
		expect(resultTwo).to.equal('uasdk:');
		var resultThree = common.substringToNIndex(testString, ':', 11);
		expect(resultThree).to.equal('uasdk::::::::::8fjka');
		var resultFour = common.substringToNIndex(testString, ':', 16);
		expect(resultFour).to.equal('uasdk::::::::::8fjka:::::aodfnasdf');
		done();
	});

	it('#works with basic use case', function(done) {
		var testString = '00\:0c\:29\:99\:21\:77:e1000g0:normal';
		var resultOne = common.substringToNIndex(testString, ':', 6);
		expect(resultOne).to.equal('00\:0c\:29\:99\:21\:77');
		done();
	});

	it('#returns full string when n is greater than number of occurances', function(done) {
		var testString = '00\:0c\:29\:99\:21\:77:e1000g0:normal';
		var resultOne = common.substringToNIndex(testString, ':', 15);
		expect(resultOne).to.equal('00\:0c\:29\:99\:21\:77:e1000g0:normal');
		done();
	});

});

