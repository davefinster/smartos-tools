var sinon = require('sinon');
var expect = require('chai').expect;
var Vmadm = require('../../lib/wrappers/vmadm');
var testEndpoint = require('../test_endpoint').defaultEnd;

describe('vmadm', function() {

	describe('list', function(){

		it('#provides a non-empty list of listable fields', function(done){
			expect(Vmadm.listableFields).to.not.equal(null);
			expect(Vmadm.listableFields).to.not.equal(undefined);
			expect(Vmadm.listableFields.length).to.not.equal(0);
			done();
		});

		it('#rejects non-existent fields', function(done) {
			var entity = new Vmadm(testEndpoint);
			entity.list(['uuid', 'alias', 'chickens'], function(err, results){
				expect(err.message).to.equal('Field chickens is not a valid field');
				expect(results).to.equal(null);
				done();
			});
		});

		it('#rejects non-listable fields', function(done) {
			var entity = new Vmadm(testEndpoint);
			entity.list(['uuid', 'alias', 'do_not_inventory'], function(err, results){
				expect(err.message).to.equal('Field do_not_inventory is not listable');
				expect(results).to.equal(null);
				done();
			});
		});

		it('#correctly parses everything with output prepared earlier', function(done){
			var expectedFields = Vmadm.listableFields.map(function(element, index){
				return element.name;
			});
			var expectedObj = { 
				alias: 'zone-2',
			    autoboot: true,
			    billing_id: '00000000-0000-0000-0000-000000000000',
			    boot_timestamp: 1435187108000,
			    brand: 'joyent',
			    cpu_cap: null,
			    cpu_shares: 100,
			    cpu_type: '',
			    dns_domain: 'local',
			    firewall_enabled: false,
			    hostname: '',
			    image_uuid: '0edf00aa-0562-11e5-b92f-879647d45790',
			    indestructible_delegated: false,
			    indestructible_zoneroot: false,
			    max_locked_memory: 512,
			    max_lwps: 2000,
			    max_physical_memory: 512,
			    max_swap: 512,
			    owner_uuid: '00000000-0000-0000-0000-000000000000',
			    quota: 5,
			    ram: 512,
			    state: 'running',
			    type: 'OS',
			    uuid: '6ea75a39-12b1-4826-9c7c-8d1aece44ad3',
			    vcpus: null,
			    zonename: '6ea75a39-12b1-4826-9c7c-8d1aece44ad3',
			    zoneid: 2,
			    zpool: 'zones' 
			};
			var outputString = 'zone-2:true:00000000-0000-0000-0000-000000000000:2015-06-24T23:05:08.000Z:joyent::100::local:::0edf00aa-0562-11e5-b92f-879647d45790:::512:2000:512:512:00000000-0000-0000-0000-000000000000:5:512:running:OS:6ea75a39-12b1-4826-9c7c-8d1aece44ad3::6ea75a39-12b1-4826-9c7c-8d1aece44ad3:2:zones:true:00000000-0000-0000-0000-000000000000:2015-06-24T23:05:08.000Z:joyent::100::local:::0edf00aa-0562-11e5-b92f-879647d45790:::512:2000:512:512:00000000-0000-0000-0000-000000000000:5:512:running:OS:6ea75a39-12b1-4826-9c7c-8d1aece44ad3::6ea75a39-12b1-4826-9c7c-8d1aece44ad3:2:zones';
			var machines = Vmadm.parseVmadmListOutput(expectedFields, outputString);
			expect(machines.length).to.equal(1);
			var machine = machines[0];
			expect(machine).to.not.equal(null);
			expect(machine).to.deep.equal(expectedObj);
			done();
		});

		it('#defaults fields to fetch when fieldSet is empty', function(done){
			var entity = new Vmadm(testEndpoint);
			var expectedFields = ['uuid', 'type', 'ram', 'state', 'alias'];
			entity.list([], function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				for ( var i = 0; i < results.length; i++ ){
					var machine = results[i];
					var fields = Object.keys(machine);
					for ( var j = 0; j < expectedFields.length; j++ ){
						expect(fields.indexOf(expectedFields[j])).to.not.equal(-1);
					}
				}
				if ( results.length > 0 ){
					validVmUuid = results[0].uuid;
				}
				done();
			});
		});

		it('#all listable fields are actually listable and are returned', function(done) {
			var expectedFields = Vmadm.listableFields.map(function(element, index){
				return element.name;
			});
			var entity = new Vmadm(testEndpoint);
			entity.list(expectedFields, function(err, results){
				expect(err).to.equal(null);
				expect(results).to.not.equal(null);
				for ( var i = 0; i < results.length; i++ ){
					var machine = results[i];
					var fields = Object.keys(machine);
					for ( var j = 0; j < expectedFields.length; j++ ){
						expect(fields.indexOf(expectedFields[j])).to.not.equal(-1);
					}
				}
				done();
			});
		});

	});

	describe('get', function(){

		it('#correctly parses everything with output prepared earlier', function(done){
			var expectedObj = { 
				zonename: '6ea75a39-12b1-4826-9c7c-8d1aece44ad3',
				autoboot: false,
				brand: 'joyent',
				image_uuid: '0edf00aa-0562-11e5-b92f-879647d45790',
				cpu_shares: 100,
				max_lwps: 2000,
				max_physical_memory: 512,
				max_locked_memory: 512,
				max_swap: 512,
				billing_id: '00000000-0000-0000-0000-000000000000',
				owner_uuid: '00000000-0000-0000-0000-000000000000',
				dns_domain: 'local',
				resolvers: [ '8.8.8.8', '8.8.4.4' ],
				alias: 'zone-2',
				uuid: '6ea75a39-12b1-4826-9c7c-8d1aece44ad3',
				zonepath: '/zones/6ea75a39-12b1-4826-9c7c-8d1aece44ad3',
				zoneid: 2,
				firewall_enabled: false,
				state: 'running',
				boot_timestamp: 1435187108000,
				customer_metadata: {},
				internal_metadata: {},
				quota: 5,
				zpool: 'zones' 
			};
			var outputString = '{ "zonename": "6ea75a39-12b1-4826-9c7c-8d1aece44ad3", "autoboot": true, "brand": "joyent", "limit_priv": "default", "v": 1, "create_timestamp": "2015-06-18T05:56:36.225Z", "image_uuid": "0edf00aa-0562-11e5-b92f-879647d45790", "cpu_shares": 100, "max_lwps": 2000, "max_msg_ids": 4096, "max_sem_ids": 4096, "max_shm_ids": 4096, "max_shm_memory": 512, "zfs_io_priority": 100, "max_physical_memory": 512, "max_locked_memory": 512, "max_swap": 512, "billing_id": "00000000-0000-0000-0000-000000000000", "owner_uuid": "00000000-0000-0000-0000-000000000000", "tmpfs": 512, "dns_domain": "local", "resolvers": [ "8.8.8.8", "8.8.4.4" ], "alias": "zone-2", "nics": [ { "interface": "net0", "mac": "32:02:2a:98:60:ba", "nic_tag": "admin", "ip": "dhcp", "primary": true } ], "uuid": "6ea75a39-12b1-4826-9c7c-8d1aece44ad3", "zone_state": "running", "zonepath": "/zones/6ea75a39-12b1-4826-9c7c-8d1aece44ad3", "zoneid": 2, "last_modified": "2015-06-18T05:57:08.000Z", "firewall_enabled": false, "server_uuid": "564d06a7-8f36-1970-f9e9-816b6c992177", "platform_buildstamp": "20150612T210440Z", "state": "running", "boot_timestamp": "2015-06-24T23:05:08.000Z", "pid": 3064, "customer_metadata": {}, "internal_metadata": {}, "routes": {}, "tags": {}, "quota": 5, "zfs_root_recsize": 131072, "zfs_filesystem": "zones/6ea75a39-12b1-4826-9c7c-8d1aece44ad3", "zpool": "zones", "snapshots": [] }';
			var outputObj = Vmadm.parseVmadmGetOutput(outputString, false);
			expect(outputObj).to.not.equal(null);
			expect(outputObj).to.deep.equal(expectedObj);
			done();
		});

		it('#fails on invalid or missing UUID', function(done){
			var entity = new Vmadm(testEndpoint);
			entity.get('chicken', false, function(err, result){
				expect(result).to.equal(null);
				expect(err).to.not.equal(null);
				expect(err.message).to.equal('Command failed: Invalid or missing UUID for get');
				done();
			});
		});

		it('#works on a valid UUID', function(done){
			var entity = new Vmadm(testEndpoint);
			entity.get(validVmUuid, false, function(err, result){
				expect(err).to.equal(null);
				expect(result).to.not.equal(null);
				done();
			});
		});

		


	});
});



