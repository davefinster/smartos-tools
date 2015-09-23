var Lib = require('../lib');

var localEnd = new Lib.Endpoint.Local();

/*
var nativeEnd = new Lib.Endpoint.NativeSsh({
	host:'127.0.0.1',
	username:'root'
});

var builtInEnd = new Lib.Endpoint.BuiltinSsh({
	host:'10.4.3.5',
	username:'root',
	password:'<a root password that works>'
});
*/

module.exports = {
	localEnd: localEnd,
	nativeEnd: localEnd,
	builtInEnd: localEnd,
	defaultEnd: localEnd
};
