var
	EventEmitter = require("events"),
	Util = require("util");

function Seed(appRoot) {
	EventEmitter.call(this);
	this.init(appRoot);
}

Util.inherits(Seed, EventEmitter);

Seed.prototype.$ = {};

Seed.prototype.init = function(appRoot) {
	global.__ROOT = appRoot;
};

Seed.prototype.run = function() {
	console.log("Loading modules & configuration ...");
	S.$.Loader = new (require("./Loader"))(this.loadComponent.bind(this));
}

Seed.prototype.loadComponent = function(name, Component, config) {
	S.$[name] = new Component(config);
	if(S.$[name].run)
		S.$[name].run();
};

module.exports = Seed;