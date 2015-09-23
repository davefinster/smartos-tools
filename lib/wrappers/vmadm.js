var assert = require('assert-plus');
var debug = require('debug')('smartos:nictagadm');
var common = require('../common');

var vmadmListDelimiter = ':';
var fields = [
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"alias"
	},
	{
		"type":"boolean",
		"vmtype":["OS","KVM"],
		"name":"archive_on_delete",
		"listable":false
	},
	{
		"type":"boolean",
		"vmtype":["OS","KVM"],
		"name":"autoboot"
	},
	{
		"type":"uuid",
		"vmtype":["OS","KVM"],
		"name":"billing_id"
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"boot",
		"listable":false
	},
	{
		"type":"iso8601",
		"vmtype":["OS","KVM"],
		"name":"boot_timestamp"
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"brand"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"cpu_cap"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"cpu_shares"
	},
	{
		"type":"string",
		"vmtype":["KVM"],
		"name":"cpu_type"
	},
	{
		"type":"object",
		"vmtype":["OS","KVM"],
		"name":"customer_metadata",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS"],
		"name":"datasets",
		"listable":false
	},
	{
		"type":"boolean",
		"vmtype":["OS"],
		"name":"delegate_dataset",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"do_not_inventory",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS"],
		"name":"dns_domain"
	},
	{
		"type":"boolean",
		"vmtype":["OS"],
		"name":"firewall_enabled"
	},
	{
		"type":"string",
		"vmtype":["OS"],
		"name":"fs_allowed",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"hostname"
	},
	{
		"type":"uuid",
		"vmtype":["OS","KVM"],
		"name":"image_uuid"
	},
	{
		"type":"object",
		"vmtype":["OS","KVM"],
		"name":"internal_metadata",
		"listable":false
	},
	{
		"type":"array",
		"vmtype":["OS","KVM"],
		"name":"internal_metadata_namespaces",
		"listable":false
	},
	{
		"type":"boolean",
		"vmtype":["OS","KVM"],
		"name":"indestructible_delegated"
	},
	{
		"type":"boolean",
		"vmtype":["OS","KVM"],
		"name":"indestructible_zoneroot"
	},
	{
		"type":"string",
		"vmtype":["LX"],
		"name":"kernel_version",
		"listable":false
	},
	{
		"type":"boolean",
		"vmtype":["OS"],
		"name":"maintain_resolvers",
		"listable":false
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"max_locked_memory"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"max_lwps"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"max_physical_memory"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"max_swap"
	},
	{
		"type":"uuid",
		"vmtype":["OS","KVM"],
		"name":"owner_uuid"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"quota"
	},
	{
		"type":"integer",
		"vmtype":["KVM"],
		"name":"ram"
	},
	{
		"type":"array",
		"vmtype":["OS","KVM"],
		"name":"resolvers",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"state"
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"type"
	},
	{
		"type":"uuid",
		"vmtype":["OS","KVM"],
		"name":"uuid"
	},
	{
		"type":"integer",
		"vmtype":["KVM"],
		"name":"vcpus"
	},
	{
		"type":"string",
		"vmtype":["KVM"],
		"name":"vnc_password",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["KVM"],
		"name":"vnc_port",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"zonepath",
		"listable":false
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"zonename"
	},
	{
		"type":"integer",
		"vmtype":["OS","KVM"],
		"name":"zoneid"
	},
	{
		"type":"string",
		"vmtype":["OS","KVM"],
		"name":"zpool"
	}
];
var listableFields = fields.filter(function(element, index, array){
	if ( element.listable !== false ){
		return true;
	}
});
var defaultFieldSet = ['uuid', 'type', 'ram', 'state', 'alias'];

function Vmadm(endpoint){
	this.endpoint = endpoint;
}

Vmadm.fields = fields;
Vmadm.listableFields = listableFields;
Vmadm.defaultFieldSet = defaultFieldSet;

Vmadm.fieldWithName = function(name){
	assert.string(name);
	for ( var i = 0; i < fields.length; i++ ){
		if ( fields[i].name == name ){
			return fields[i];
		}
	}
	return null;
}

Vmadm.fieldsAreListable = function(fieldSet){
	for ( var i = 0; i < fieldSet.length; i++ ){
		var fieldName = fieldSet[i];
		var fieldMatch = Vmadm.fieldWithName(fieldName);
		if ( fieldMatch == null ){
			//field doesn't exist
			return new Error("Field " + fieldName + " is not a valid field");
		}else if ( fieldMatch.listable == false ){
			return new Error("Field " + fieldName + " is not listable");
		}
	}
	return true;
}

Vmadm.ensureFieldType = function(value, fieldType){
	if ( value == null ){
		return null;
	}else if ( fieldType == 'integer' ){
		if ( value.length == 0 ){
			return null;
		}
		return parseInt(value);
	}else if ( fieldType == 'boolean' ){
		return value == 'true';
	}else if ( fieldType == 'iso8601') {
		return Date.parse(value);
	}else{
		return value;
	}
}

Vmadm.parseVmadmListLine = function(fieldSet, line){
	assert.string(line);
	var vmLine = line;
	debug('parsing ', line);
	var machine = {};
	for ( var i = 0; i < fieldSet.length; i++ ){
		var key = fieldSet[i];
		var fieldDef = Vmadm.fieldWithName(key);
		var delimCount = 1;
		if ( fieldDef.type == 'iso8601'){
			delimCount = 3;
		}
		var substringIndex = common.nIndexOf(vmLine, ':', delimCount);
		var substring = vmLine.substring(0,
			(substringIndex >= 0 ? substringIndex:vmLine.length));
		machine[key] = Vmadm.ensureFieldType(substring, fieldDef.type);
		vmLine = vmLine.substring(substringIndex + 1, vmLine.length);
	}
	return machine;
}

Vmadm.parseVmadmListOutput = function(fieldSet, output){
	debug('parsing vmadm output');
	var lines = output.split('\n');
	var machines = [];
	for ( var i = 0; i < lines.length; i++ ){
		var line = lines[i];
		if ( line.length == 0 ){
			continue;
		}
		var machine = Vmadm.parseVmadmListLine(fieldSet, line);
		if ( machine != null ){
			machines.push(machine);
		}
	}
	debug('parsed vmadm output');
	return machines;
}

Vmadm.parseVmadmGetOutput = function(output, includeUndocumentedFields){
	assert.string(output);
	assert.bool(includeUndocumentedFields);
	var returnObj = {};
	var result = JSON.parse(output);
	var keys = Object.keys(result);
	for ( var i = 0; i < keys.length; i++ ){
		var key = keys[i];
		var fieldDef = Vmadm.fieldWithName(key);
		if ( fieldDef != null ){
			returnObj[key] = Vmadm.ensureFieldType(result[key], fieldDef.type);
		}else if (includeUndocumentedFields){
			returnObj[key] = result[key];
		}
	}
	return returnObj;
}

Vmadm.prototype.list = function(listFieldSet, cb){
	//check that the requested fields are all listable
	var fieldSet = listFieldSet;
	if (( fieldSet == null ) || ( fieldSet.length == 0 )){
		fieldSet = ['uuid', 'type', 'ram', 'state', 'alias'];
	}
	debug('vmadm list fieldset ', fieldSet);
	assert.func(cb, 'callback');
	var callback = cb;
	var checkField = Vmadm.fieldsAreListable(fieldSet);
	if ( checkField !== true ){
		callback(checkField, null);
		return;
	}
	var execCmd = 'vmadm list -p -o ' + fieldSet.join(',');
	debug('spawning child with ', execCmd);
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		debug('child execution complete');
		if ( error != null ){
			debug('child received error', error);
			var returnError = 'General error';
			if ( error.code == 127 ){
				returnError = 'vmadm not found - Unable to run';
			}
			callback(returnError, null);
			return
		}
		var parsed = Vmadm.parseVmadmListOutput(fieldSet, stdout);
		callback(null, parsed);
	});
}

Vmadm.prototype.info = function(uuid, cb){
	assert.string(uuid, 'vm uuid');
	assert.func(cb, 'callback');
	var callback = cb;
	var execCmd = 'vmadm info ' + uuid;
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			if ( error.message != null ){
				var firstLine = error.message.split('\n')[0];
				callback(new Error(firstLine), null);
				return;
			}
			callback(error, null);
			return;
		}
		if ( stderr.length > 0 ){
			var lines = stderr.split('\n');
			if ( lines[0].indexOf('Invalid or missing UUID') != -1 ){
				callback(new Error('Command failed: ' + lines[0]), null);
				return;
			}else if ( lines[0].indexOf('only supported for KVM VMs') != -1 ){
				callback(new Error('Command failed: ' + lines[0]), null);
				return;
			}
		}
		var returnObj = null;
		var errorObj = null
		try{
			returnObj = JSON.parse(stdout);
		}catch(err){
			errorObj = new Error('Unable to parse response: ' + stdout);
		}
		callback(errorObj, returnObj);
	});
}

Vmadm.prototype.get = function(uuid, includeUndocumentedFields, cb){
	assert.string(uuid, 'vm uuid');
	assert.bool(includeUndocumentedFields, 'include undocumented fields');
	assert.func(cb, 'callback');
	var includeUndoc = includeUndocumentedFields;
	var callback = cb;
	var execCmd = 'vmadm get ' + uuid;
	var child = this.endpoint.exec(execCmd, function(error, stdout, stderr){
		if ( error != null ){
			if ( error.message != null ){
				var firstLine = error.message.split('\n')[0];
				callback(new Error(firstLine), null);
				return;
			}
			callback(error, null);
			return;
		}
		if ( stderr.length > 0 ){
			var lines = stderr.split('\n');
			if ( lines[0].indexOf('Invalid or missing UUID') != -1 ){
				callback(new Error('Command failed: ' + lines[0]), null);
				return;
			}
		}
		var returnObj = Vmadm.parseVmadmGetOutput(stdout, includeUndoc);
		callback(null, returnObj);
	});
}

module.exports = Vmadm;
