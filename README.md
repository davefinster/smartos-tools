# smartos-tools

smartos-tools provides read-only wrappers for the standard SmartOS management tools such as vmadm/nictagadm/sysinfo/zfs/zpool. It attempts to parse as much data as possible into native Javascript structures. 

Also, it does not need to run on the SmartOS host itself as 3 different endpoints are supported:
  
  - 'Local' executes the commands locally via the node 'child_process' module
  - 'NativeSsh' leverages a local installation of SSH (relies on the SSH bin being in PATH) to execute commands remotely
  - 'BuiltinSsh' uses the ssh2 library (native node.js SSH implmenetation) to execute commands remotely.

The primary difference between Native and Builtin SSH will be performance and integrated authentication. NativeSsh will behave as though the user that node is running under has attempted to execute the commands. The implication is typically that the destination host must be in the KnownHosts file for the user (or globally) and public key authentication should already be functional. BuiltinSsh will also work with public key authentication but also supports password auth. BuiltinSsh requires the user to supply the private key as either a string or buffer (as per ssh2 docs).

## Usage

```javascript
var smartos = require('smartos-tools');

var endpoint = smartos.Endpoint.BuiltinSsh({
  host: '127.0.0.1',
  username: 'root',
  password: 'password'
});

var host = smartos.Host(endpoint);

host.vmadm.list(null, function(err, vmList){
  var vm = vmList[0];
  host.vmadm.get(vm.uuid, false, function(err, vmPayload){

  });
});
```

## Installation

    npm install smartos-tools

## License

MIT.

## Bugs

See <https://github.com/davefinster/smartos-tools/issues>.