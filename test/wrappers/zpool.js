var sinon = require('sinon');
var expect = require('chai').expect;
var Zpool = require('../../lib/wrappers/zpool');
var testEndpoint = require('../test_endpoint').defaultEnd;

describe('zpool', function() {

	describe('status', function(){

		it('#runs with input prepared earlier', function(done){
			var testString = 'pool: zones\nstate: ONLINE\nscan: none requested\nconfig:\nNAME        STATE     READ WRITE CKSUM\nzones       ONLINE       0     0     0\n	  mirror-0  ONLINE       0     0     0\n	    c0t1d0  ONLINE       0     0     0\n	    c0t2d0  ONLINE       0     0     0\n\nerrors: No known data errors';
			var pools = Zpool.parseZpoolStatusOutput(testString);
			expect(pools).to.not.equal(null);
			expect(pools.length).to.equal(1);
			done();
		});

		it('#correctly parses with input prepared earlier', function(done){
			var testString = 'pool: zones\nstate: ONLINE\nscan: none requested\nconfig:\nNAME        STATE     READ WRITE CKSUM\nzones       ONLINE       0     0     0\n	  mirror-0  ONLINE       0     0     0\n	    c0t1d0  ONLINE       0     0     0\n	    c0t2d0  ONLINE       0     0     0\n\nerrors: No known data errors';
			var expectedObj = {
      name: 'zones',
      state: 'ONLINE',
      scan: 'none requested',
      config: '',
      errors: 'No known data errors',
      layout:
       [ { type: 'data',
           name: 'zones',
           state: 'ONLINE',
           read: 0,
           write: 0,
           cksum: 0,
           layout:
            [ { devices:
                 [ { name: 'c0t1d0',
                     type: 'disk',
                     state: 'ONLINE',
                     read: 0,
                     write: 0,
                     cksum: 0 },
                   { name: 'c0t2d0',
                     type: 'disk',
                     state: 'ONLINE',
                     read: 0,
                     write: 0,
                     cksum: 0 } ],
                name: 'mirror-0',
                type: 'mirror',
                state: 'ONLINE',
                read: 0,
                write: 0,
                cksum: 0
              } ]
            } ]
      };
			var pools = Zpool.parseZpoolStatusOutput(testString);
			expect(pools).to.not.equal(null);
			expect(pools.length).to.equal(1);
			expect(pools[0]).to.deep.equal(expectedObj);
			done();
		});

		it('#runs with complex input prepared earlier', function(done){
			var testString = 'pool: zones\n state: ONLINE\n  scan: none requested\nconfig:\n        NAME                        STATE     READ WRITE CKSUM\n        zones                       ONLINE       0     0     0\n          mirror-0                  ONLINE       0     0     0\n            c0t5000CCA03900B029d0   ONLINE       0     0     0\n            c1t5000CCA03900CD61d0   ONLINE       0     0     0\n          mirror-1                  ONLINE       0     0     0\n            c4t5000CCA03907650Dd0   ONLINE       0     0     0\n            c5t5000CCA0390764F5d0   ONLINE       0     0     0\n          mirror-2                  ONLINE       0     0     0\n            c6t5000CCA03900D331d0   ONLINE       0     0     0\n            c7t5000CCA039076539d0   ONLINE       0     0     0\n          mirror-3                  ONLINE       0     0     0\n            c9t5000CCA03900D279d0   ONLINE       0     0     0\n            c10t5000CCA03900D62Dd0  ONLINE       0     0     0\n          mirror-4                  ONLINE       0     0     0\n            c11t5000CCA03907661Dd0  ONLINE       0     0     0\n            c12t5000CCA03907660Dd0  ONLINE       0     0     0\n          mirror-5                  ONLINE       0     0     0\n            c13t5000CCA03900CEC5d0  ONLINE       0     0     0\n            c14t5000CCA0390765D9d0  ONLINE       0     0     0\n        logs\n          c2t5000CCA049042AB5d0     ONLINE       0     0     0\n          c3t5000CCA0490426FDd0     ONLINE       0     0     0\n        spares\n          c15t5000CCA03900D02Dd0    AVAIL\n          c16t5000CCA03900CE51d0    AVAIL\n\nerrors: No known data errors';
			var expectedObj = {
        name: 'zones',
        state: 'ONLINE',
        scan: 'none requested',
        config: '',
        errors: 'No known data errors',
        layout:
         [ { type: 'data',
             name: 'zones',
             state: 'ONLINE',
             read: 0,
             write: 0,
             cksum: 0,
             layout:
              [ { devices:
                   [ { name: 'c0t5000CCA03900B029d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c1t5000CCA03900CD61d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-0',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { devices:
                   [ { name: 'c4t5000CCA03907650Dd0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c5t5000CCA0390764F5d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-1',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { devices:
                   [ { name: 'c6t5000CCA03900D331d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c7t5000CCA039076539d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-2',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { devices:
                   [ { name: 'c9t5000CCA03900D279d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c10t5000CCA03900D62Dd0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-3',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { devices:
                   [ { name: 'c11t5000CCA03907661Dd0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c12t5000CCA03907660Dd0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-4',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { devices:
                   [ { name: 'c13t5000CCA03900CEC5d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 },
                     { name: 'c14t5000CCA0390765D9d0',
                       type: 'disk',
                       state: 'ONLINE',
                       read: 0,
                       write: 0,
                       cksum: 0 } ],
                  name: 'mirror-5',
                  type: 'mirror',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 } ] },
           { type: 'log',
             name: 'logs',
             layout:
              [ { name: 'c2t5000CCA049042AB5d0',
                  type: 'disk',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                { name: 'c3t5000CCA0490426FDd0',
                  type: 'disk',
                  state: 'ONLINE',
                  read: 0,
                  write: 0,
                  cksum: 0 },
                null ] },
           { type: 'spare',
             name: 'spares',
             layout:
              [ { name: 'c15t5000CCA03900D02Dd0',
                  type: 'disk',
                  state: 'AVAIL',
                  read: null,
                  write: null,
                  cksum: null },
                { name: 'c16t5000CCA03900CE51d0',
                  type: 'disk',
                  state: 'AVAIL',
                  read: null,
                  write: null,
                  cksum: null },
                null ] } ] };
      var pools = Zpool.parseZpoolStatusOutput(testString);
			expect(pools).to.not.equal(null);
			expect(pools.length).to.equal(1);
      expect(pools[0]).to.deep.equal(expectedObj);
			done();
		});

  it('#works with multiple complex zpools', function(done){
    var testString = 'pool: fastssd\n state: ONLINE\n  scan: none requested\nconfig:\n        NAME                       STATE     READ WRITE CKSUM\nfastssd                    ONLINE       0     0     0\n          mirror-0                 ONLINE       0     0     0\n            c0t55CD2E404B65E72Ed0  ONLINE       0     0     0\n            c0t55CD2E404B65E981d0  ONLINE       0     0     0\n          mirror-1                 ONLINE       0     0     0\n            c0t55CD2E404B641A72d0  ONLINE       0     0     0\n            c0t55CD2E404B648707d0  ONLINE       0     0     0\n\nerrors: No known data errors\n\n  pool: zones\n state: ONLINE\n  scan: none requested\nconfig:\n\n        NAME                         STATE     READ WRITE CKSUM\n        zones                        ONLINE       0     0     0\n          raidz2-0                   ONLINE       0     0     0\n            c4t5000CCA0386A55D5d0    ONLINE       0     0     0\n            c4t5000CCA0386A55E5d0    ONLINE       0     0     0\n            c4t5000CCA0386A5811d0    ONLINE       0     0     0\n            c4t5000CCA03865C7ADd0    ONLINE       0     0     0\n            c4t5000CCA038667CE9d0    ONLINE       0     0     0\n            c4t5000CCA038667D39d0    ONLINE       0     0     0\n            c4t5000CCA038685D71d0    ONLINE       0     0     0\n            c4t5000CCA038685FE5d0    ONLINE       0     0     0\n          raidz2-1                   ONLINE       0     0     0\n            c4t5000CCA038693C19d0    ONLINE       0     0     0\n            c4t5000CCA0386674F1d0    ONLINE       0     0     0\n            c4t5000CCA0386910EDd0    ONLINE       0     0     0\n            c4t5000CCA0386973ADd0    ONLINE       0     0     0\n            c4t5000CCA03868524Dd0    ONLINE       0     0     0\n            c4t5000CCA038684749d0    ONLINE       0     0     0\n            c4t5000CCA038689095d0    ONLINE       0     0     0\n            c4t5000CCA038689269d0    ONLINE       0     0     0\n        logs\n          mirror-2                   ONLINE       0     0     0\n            c0t55CD2E404B65250Ed0p0  ONLINE       0     0     0\n            c0t55CD2E404B636939d0p0  ONLINE       0     0     0\n        cache\n          c0t55CD2E404B65250Ed0p1    ONLINE       0     0     0\n          c0t55CD2E404B636939d0p2    ONLINE       0     0     0\n\nerrors: No known data errors';
    var expectedObj = [ { name: 'fastssd',
    state: 'ONLINE',
    scan: 'none requested',
    config: '',
    errors: 'No known data errors',
    layout:
     [ { type: 'data',
         name: 'fastssd',
         state: 'ONLINE',
         read: 0,
         write: 0,
         cksum: 0,
         layout:
          [ { devices:
               [ { name: 'c0t55CD2E404B65E72Ed0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c0t55CD2E404B65E981d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 } ],
              name: 'mirror-0',
              type: 'mirror',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 },
            { devices:
               [ { name: 'c0t55CD2E404B641A72d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c0t55CD2E404B648707d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 } ],
              name: 'mirror-1',
              type: 'mirror',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 } ] } ] },
  { name: 'zones',
    state: 'ONLINE',
    scan: 'none requested',
    config: '',
    errors: 'No known data errors',
    layout:
     [ { type: 'data',
         name: 'zones',
         state: 'ONLINE',
         read: 0,
         write: 0,
         cksum: 0,
         layout:
          [ { devices:
               [ { name: 'c4t5000CCA0386A55D5d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA0386A55E5d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA0386A5811d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA03865C7ADd0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038667CE9d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038667D39d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038685D71d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038685FE5d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 } ],
              name: 'raidz2-0',
              type: 'raidz',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 },
            { devices:
               [ { name: 'c4t5000CCA038693C19d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA0386674F1d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA0386910EDd0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA0386973ADd0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA03868524Dd0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038684749d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038689095d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c4t5000CCA038689269d0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 } ],
              name: 'raidz2-1',
              type: 'raidz',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 } ] },
       { type: 'log',
         name: 'logs',
         layout:
          [ { devices:
               [ { name: 'c0t55CD2E404B65250Ed0p0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 },
                 { name: 'c0t55CD2E404B636939d0p0',
                   type: 'disk',
                   state: 'ONLINE',
                   read: 0,
                   write: 0,
                   cksum: 0 } ],
              name: 'mirror-2',
              type: 'mirror',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 } ] },
       { type: 'cache',
         name: 'cache',
         layout:
          [ { name: 'c0t55CD2E404B65250Ed0p1',
              type: 'disk',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 },
            { name: 'c0t55CD2E404B636939d0p2',
              type: 'disk',
              state: 'ONLINE',
              read: 0,
              write: 0,
              cksum: 0 },
            null ] } ] } ];
    var pools = Zpool.parseZpoolStatusOutput(testString);
    expect(pools).to.not.equal(null);
    expect(pools.length).to.equal(2);
    //var util = require('util');
    //console.log(util.inspect(pools, false, null));
    expect(pools).to.deep.equal(expectedObj);
    done();
  });


	it('#works with a resilvering pool', function(done){
		var testString = 'pool: zones\nstate: ONLINE\nstatus: One or more devices is currently being resilvered.  The pool will\ncontinue to function, possibly in a degraded state.\naction: Wait for the resilver to complete.\nscan: resilver in progress since Sun Aug 30 20:36:50 2015\n  5.51T scanned out of 9.07T at 56.6M/s, 18h18m to go\n  230G resilvered, 60.78% done\nconfig:\nNAME                         STATE     READ WRITE CKSUM\nzones                        ONLINE       0     0     0\n  raidz2-0                   ONLINE       0     0     0\n    c0t5000CCA04173EC78d0    ONLINE       0     0     0\n    c0t5000CCA04181BF9Cd0    ONLINE       0     0     0\n    c0t5000CCA04181BEDCd0    ONLINE       0     0     0\n    c0t5000CCA04181C3A4d0    ONLINE       0     0     0\n    c0t5000CCA04181C3F8d0    ONLINE       0     0     0\n    c0t5000CCA04174501Cd0    ONLINE       0     0     0\n    c0t5000CCA04181C0F8d0    ONLINE       0     0     0\n    c0t5000CCA03800A41Cd0    ONLINE       0     0     0\n  raidz2-1                   ONLINE       0     0     0\n    c0t5000CCA03800B834d0    ONLINE       0     0     0\n    c0t5000CCA041D7E978d0    ONLINE       0     0     0\n    c0t5000CCA03800B91Cd0    ONLINE       0     0     0\n    c0t5000CCA03800B6E0d0    ONLINE       0     0     0\n    c0t5000CCA03800B7C0d0    ONLINE       0     0     0\n    c0t5000CCA038009084d0    ONLINE       0     0     0\n    c0t5000CCA03800BA64d0    ONLINE       0     0     0\n    spare-7                  ONLINE       0     0     0\n      c0t5000CCA041D69C30d0  ONLINE       0     0     1\n      c0t5000CCA03834B7BCd0  ONLINE       0     0     0  (resilvering)\n  raidz2-3                   ONLINE       0     0     0\n    c0t5000CCA03868CE48d0    ONLINE       0     0     0\n    c0t5000CCA038684A50d0    ONLINE       0     0     0\n    c0t5000CCA038685FDCd0    ONLINE       0     0     0\n    c0t5000CCA038688CD4d0    ONLINE       0     0     0\n    c0t5000CCA038688DB4d0    ONLINE       0     0     0\n    c0t5000CCA038688EFCd0    ONLINE       0     0     0\n    c0t5000CCA0386673FCd0    ONLINE       0     0     0\n    c0t5000CCA03868933Cd0    ONLINE       0     0     0\nlogs\n  c0t55CD2E404B4F0D8Dd0      ONLINE       0     0     0\n  c0t5000C5002FF03DB1d0      ONLINE       0     0     0\nspares\n  c0t5000CCA03834B7BCd0      INUSE     currently in use\n\nerrors: No known data errors';
		var pools = Zpool.parseZpoolStatusOutput(testString);
    expect(pools).to.not.equal(null);
    expect(pools.length).to.equal(1);
    var util = require('util');
    //console.log(util.inspect(pools, false, null));
    done();
	});

  it('#status successfully', function(done){
      var entity = new Zpool(testEndpoint);
      entity.status(function(err, results){
        expect(err).to.equal(null);
        expect(results).to.not.equal(null);
        expect(results.length).to.not.equal(0);
        done();
      });
    });

	});

	describe('list', function(){

    it('#runs with input prepared earlier', function(done){
      var testString = 'NAME    SIZE  ALLOC   FREE  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROOT\nzones  19.9G  1.49G  18.4G         -     4%     7%  1.00x  ONLINE  -';
      var results = Zpool.parseZpoolListOutput(testString);
      expect(results).to.not.equal(null);
      expect(results.length).to.equal(1);
      done();
    });

    it('#correctly parses with input prepared earlier', function(done){
      var testString = 'NAME    SIZE  ALLOC   FREE  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROOT\nzones  19.9G  1.49G  18.4G         -     4%     7%  1.00x  ONLINE  -';
      var expectedObj = [ {
        name: 'zones',
        size: '19.9G',
        alloc: '1.49G',
        free: '18.4G',
        expandsz: '-',
        frag: '4%',
        cap: '7%',
        dedup: '1.00x',
        health: 'ONLINE',
        altroot: '-'
      } ];
      var results = Zpool.parseZpoolListOutput(testString);
      expect(results).to.not.equal(null);
      expect(results.length).to.equal(1);
      expect(results).to.deep.equal(expectedObj);
      done();
    });

    it('#correctly parses with multiple zpool input prepared earlier', function(done){
      var testString = '  NAME      SIZE  ALLOC   FREE   FRAG  EXPANDSZ    CAP  DEDUP  HEALTH  ALTROOT\nfastssd   744G   327G   417G    32%         -    43%  1.00x  ONLINE  -\nzones    8.69T   846G  7.86T     7%         -     9%  1.00x  ONLINE  -';
      var expectedObj = [ { name: 'fastssd',
    size: '744G',
    alloc: '327G',
    free: '417G',
    frag: '32%',
    expandsz: '-',
    cap: '43%',
    dedup: '1.00x',
    health: 'ONLINE',
    altroot: '-' },
  { name: 'zones',
    size: '8.69T',
    alloc: '846G',
    free: '7.86T',
    frag: '7%',
    expandsz: '-',
    cap: '9%',
    dedup: '1.00x',
    health: 'ONLINE',
    altroot: '-' } ];
      var results = Zpool.parseZpoolListOutput(testString);
      expect(results).to.not.equal(null);
      expect(results.length).to.equal(2);
      expect(results).to.deep.equal(expectedObj);
      done();
    });

    it('#lists successfully', function(done){
      var entity = new Zpool(testEndpoint);
      entity.list(function(err, results){
        expect(err).to.equal(null);
        expect(results).to.not.equal(null);
        done();
      });
    });

	});

});
