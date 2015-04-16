var
	EventEmitter = require("events"),
	Util = require("util");

function Seed(config) {
	EventEmitter.call(this);
	this.config = config || {};
	this.components = [];
	this.init();
}

Util.inherits(Seed, EventEmitter);

Seed.prototype.$ = {};

Seed.prototype.init = function() {
	global.__ROOT = config.appRoot;
	this.globalModules: require("./GlobalModules");
	this.globalize();
};

Seed.prototype.globalize = function() {
	for(var module in this.globalModules) {
		global[module] = require(this.globalModules[module]);
	}
};

Seed.prototype.push = function(component) {
	var name = component.constructor.name;
	this.components.push(name);
	S.$[name] = component;
};

Seed.prototype.run = function() {
	console.log("Loading modules & configuration ...");
	this.components.forEach(function (component) {
		S.$[component].run();
	});
	S.emit("all-components-loaded");
};

module.exports = Seed;