var LocalEndpoint = require('./endpoints/local');
var Wrapper = require('./wrappers/');

function Host(options){
	this._vmadm = null;
	this._nictagadm = null;
	this._sysinfo = null;
	this._zfs = null;
	this._zpool = null;
    this._imgadm = null;
	this.endpoint = options.endpoint;
	if ( this.endpoint == null ){
		this.endpoint = new LocalEndpoint();
	}
}

Host.prototype = {
    get vmadm(){
    	if ( this._vmadm == null ){
    		this._vmadm = new Wrapper.Vmadm(this.endpoint);
    	}
        return this._vmadm;
    },
    get nictagadm(){
    	if ( this._nictagadm == null ){
    		this._nictagadm = new Wrapper.Nictagadm(this.endpoint);
    	}
        return this._nictagadm;
    },
    get sysinfo(){
    	if ( this._sysinfo == null ){
    		this._sysinfo = new Wrapper.Sysinfo(this.endpoint);
    	}
        return this._sysinfo;
    },
    get zfs(){
    	if ( this._zfs == null ){
    		this._zfs = new Wrapper.Zfs(this.endpoint);
    	}
        return this._zfs;
    },
    get zpool(){
    	if ( this._zpool == null ){
    		this._zpool = new Wrapper.Zpool(this.endpoint);
    	}
        return this._zpool;
    },
    get imgadm(){
        if ( this._imgadm == null ){
            this._imgadm = new Wrapper.Imgadm(this.endpoint);
        }
        return this._imgadm;
    }
};

module.exports = Host;
