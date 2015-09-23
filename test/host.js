var sinon = require('sinon');
var expect = require('chai').expect;
var Host = require('../lib/host');
var builtinSshEndpoint = require('../lib/endpoints/builtin_ssh');
var testEndpoint = require('./test_endpoint').defaultEnd;

describe('host', function() {

	it('#can use vmadm', function(done) {
		this.timeout(5000);
		var host = new Host({
			endpoint: testEndpoint
		});
		host.vmadm.list(null, function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			host.vmadm.get(results[0].uuid, false, function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				done();
			});
		});
	});


	it('#can use nictagadm', function(done) {
		var host = new Host({
			endpoint: testEndpoint
		});
		host.nictagadm.list(function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			done();
		});
	});

	it('#can use sysinfo', function(done) {
		var host = new Host({
			endpoint: testEndpoint
		});
		host.sysinfo.fetch(function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			done();
		});
	});

	it('#can use zpool', function(done) {
		var host = new Host({
			endpoint: testEndpoint
		});
		host.zpool.status(function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			host.zpool.list(function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				done();
			});
		});
	});

	it('#can use zfs', function(done) {
		var host = new Host({
			endpoint: testEndpoint
		});
		host.zfs.list(null, null, null, function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			done();
		});
	});

	it('#can use imgadm', function(done) {
		var host = new Host({
			endpoint: testEndpoint
		});
		host.imgadm.list(function(err, results){
			expect(err).to.equal(null);
			expect(results).to.not.equal(null);
			done();
		});
	});

});