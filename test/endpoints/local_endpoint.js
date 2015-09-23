var sinon = require('sinon');
var expect = require('chai').expect;
var testEndpoints = require('../test_endpoint');

describe('localEndpoint', function() {
	it('#works', function(done) {
		var end = testEndpoints.localEnd;
		end.exec('echo chickens everywhere', function(error, stdout, stderr){
			expect(stdout).to.equal('chickens everywhere\n');
			done();
		});
	});
});

