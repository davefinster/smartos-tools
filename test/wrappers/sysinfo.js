var sinon = require('sinon');
var expect = require('chai').expect;
var Sysinfo = require('../../lib/wrappers/sysinfo');
var testEndpoint = require('../test_endpoint').defaultEnd;

describe('sysinfo', function() {
	describe('fetch', function(){

		it('#fetches successfully', function(done) {
			var entity = new Sysinfo(testEndpoint);
			entity.fetch(function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				done();
			});
		});

	});
});

