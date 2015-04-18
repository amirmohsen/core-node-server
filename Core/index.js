function Seed(config) {
	EventEmitter.call(this);
	this.config = config || {};
	this.components = [];
	this.init();
}

Util.inherits(Seed, EventEmitter);

Seed.prototype.$ = {};

Seed.prototype.init = function() {
	global.__ROOT = this.config.appRoot;
	global.S = this;
	global.A = {};
};

Seed.prototype.push = function(name, component) {
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