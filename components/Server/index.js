var EventEmitter = require('events');
var Util = require('util');

function Server() {
	EventEmitter.call(this);
	this.init();
}

Util.inherits(Server, EventEmitter);

Server.prototype.init = function() {
	this.app = Express();
	this.staticApp = Express();
	this.httpServer = HTTP.createServer(this.app);
	this.httpsServer = null;
	this.once("all_ready", this.run.bind(this));
};

Server.prototype.run = function() {
	
};

Server.prototype.resolveDep = function() {

};