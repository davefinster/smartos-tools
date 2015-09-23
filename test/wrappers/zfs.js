var sinon = require('sinon');
var expect = require('chai').expect;
var Zfs = require('../../lib/wrappers/zfs');
var testEndpoint = require('../test_endpoint').defaultEnd;
describe('zfs', function() {

	describe('list', function(){

		it('#works with defaults', function(done){
			var entity = new Zfs(testEndpoint);
			entity.list(null, null, null, function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				done();
			});
		});

		it('#fails with incorrect property', function(done){
			var entity = new Zfs(testEndpoint);
			entity.list('asdf', null, null, function(err, results){
				expect(results).to.equal(null);
				expect(err).to.not.equal(null);
				expect(err.message).to.equal("Command failed: bad property list: invalid property 'asdf'");
				done();
			});
		});

		it('#fails with incorrect type', function(done){
			var entity = new Zfs(testEndpoint);
			entity.list(null, 'chicken', null, function(err, results){
				expect(results).to.equal(null);
				expect(err).to.not.equal(null);
				expect(err.message).to.equal("Command failed: invalid type 'chicken'");
				done();
			});
		});

		it('#can list snapshots', function(done){
			var entity = new Zfs(testEndpoint);
			entity.list(null, 'chicken', null, function(err, results){
				expect(results).to.equal(null);
				expect(err).to.not.equal(null);
				expect(err.message).to.equal("Command failed: invalid type 'chicken'");
				done();
			});
		});

	});

});

