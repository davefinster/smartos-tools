var sinon = require('sinon');
var expect = require('chai').expect;
var Nictagadm = require('../../lib/wrappers/nictagadm');
var testEndpoint = require('../test_endpoint').defaultEnd;

describe('nictagadmProcessor', function() {
	describe('list', function(){

		it('#correctly parses everything with output prepared earlier', function(done) {
			var expectedObj = { 
				name: 'admin',
			    macAddress: '00:0c:29:99:21:77',
			    interface: 'e1000g0',
			    type: 'normal' 
			};
			var outputString = 'admin:00\:0c\:29\:99\:21\:77:e1000g0:normal';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with nictagadm that doesnt provide type', function(done) {
			var expectedObj = { 
				name: 'admin',
			    macAddress: '00:0c:29:99:21:77',
			    interface: 'e1000g0',
			    type: null 
			};
			var outputString = 'admin:00\:0c\:29\:99\:21\:77:e1000g0';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with aggrs', function(done) {
			var expectedObj = { 
				name: 'admin',
			    macAddress: null,
			    interface: 'aggr0',
			    type: 'aggr' 
			};
			var outputString = 'admin:-:aggr0:aggr';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with aggrs without type', function(done) {
			var expectedObj = { 
				name: 'admin',
			    macAddress: null,
			    interface: 'aggr0',
			    type: null 
			};
			var outputString = 'admin:-:aggr0';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with stubs that just provide a name', function(done) {
			var expectedObj = { 
				name: 'wanrouterstub0',
			    macAddress: null,
			    interface: null,
			    type: 'stub' 
			};
			var outputString = 'wanrouterstub0:-:-:stub';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with stubs that just provide a name without type', function(done) {
			var expectedObj = { 
				name: 'wanrouterstub0',
			    macAddress: null,
			    interface: null,
			    type: null 
			};
			var outputString = 'wanrouterstub0:-:-';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(1);
			var tag = tags[0];
			expect(tag).to.not.equal(null);
			expect(tag).to.deep.equal(expectedObj);
			done();
		});

		it('#works with complex layout', function(done) {
			var expectedObj = [
			{ 
				name: 'lan',
			    macAddress: '00\:25\:90\:fc\:91\:8f',
			    interface: 'igb3',
			    type: 'normal' 
			},{
				name: 'accellan',
			    macAddress: '00\:25\:90\:fc\:91\:8e',
			    interface: 'igb2',
			    type: 'normal' 
			},{
				name: 'accelwan',
			    macAddress: '00\:25\:90\:fc\:91\:8d',
			    interface: 'igb1',
			    type: 'normal' 
			},{
				name: 'admin',
			    macAddress: '00\:25\:90\:fc\:91\:8c',
			    interface: 'igb0',
			    type: 'normal' 
			}];
			var outputString = 'lan:00\:25\:90\:fc\:91\:8f:igb3:normal\naccellan:00\:25\:90\:fc\:91\:8e:igb2:normal\naccelwan:00\:25\:90\:fc\:91\:8d:igb1:normal\nadmin:00\:25\:90\:fc\:91\:8c:igb0:normal';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(4);
			expect(tags).to.deep.equal(expectedObj);
			done();
		});

		it('#works with crazy layout', function(done) {
			var expectedObj = [
			{ 
				name: 'lan',
			    macAddress: null,
			    interface: 'igb3',
			    type: 'normal' 
			},{
				name: 'accellan',
			    macAddress: null,
			    interface: null,
			    type: 'normal' 
			},{
				name: 'accelwan',
			    macAddress: null,
			    interface: 'igb1',
			    type: null 
			},{
				name: 'admin',
			    macAddress: '00\:25\:90\:fc\:91\:8c',
			    interface: 'igb0',
			    type: 'normal' 
			}];
			var outputString = 'lan:-:igb3:normal\naccellan:-:-:normal\naccelwan:-:igb1\nadmin:00\:25\:90\:fc\:91\:8c:igb0:normal';
			var tags = Nictagadm.parseNictagadmOutput(outputString);
			expect(tags.length).to.equal(4);
			expect(tags).to.deep.equal(expectedObj);
			done();
		});

		it('#lists successfully', function(done) {
			var entity = new Nictagadm(testEndpoint);
			entity.list(function(err, result){
				expect(err).to.equal(null);
				expect(result).to.not.equal(null);
				done();
			});
		});

	});
});