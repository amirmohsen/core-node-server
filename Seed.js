function Seed(appRoot) {
	EventEmitter.call(this);
	global.__ROOT = appRoot;
	this.init();
}

Util.inherits(Seed, EventEmitter);

Seed.$ = {};

Seed.prototype.init = function(appRoot) {
	console.log("Loading modules & configuration ...");
	Seed.$.Loader = require("./Loader.js");
	Seed.$.Loader.globalize().config().load(Seed.run.bind(this));
};

Seed.prototype.run = function(name, Component) {
	Seed.$[name] = new Component();
};

module.exports = Seed;