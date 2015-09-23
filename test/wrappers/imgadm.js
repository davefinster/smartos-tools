var sinon = require('sinon');
var expect = require('chai').expect;
var Imgadm = require('../../lib/wrappers/imgadm');
var testEndpoint = require('../test_endpoint').defaultEnd;

describe('nictagadmProcessor', function() {
	describe('list', function(){
		it('#lists successfully', function(done){
			var entity = new Imgadm(testEndpoint);
			entity.list(function(err, results){
				console.log(results);
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				done();
			});
		});
	});
});