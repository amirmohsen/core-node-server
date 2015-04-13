function Loader(componentStartupCallback) {
	this.init(componentStartupCallback);
}

Loader.prototype = {
	
	globalModules: require("./GlobalModules"),

	init: function(componentStartupCallback) {
		this.globalize();
		this.config();
		this.load(componentStartupCallback);
	},

	globalize: function() {
		for(var module in this.globalModules) {
			global[module] = require(this.globalModules[module]);
		}
	},

	config: function() {
		var config = require(Path.join(__ROOT, "/config"));		
		S.config = config.core;
		A.config = config.app;
	},

	load: function(componentStartupCallback) {
		S.config.components.forEach((function(component) {
			try {
				var componentClass = require("./components/" + component.name);
				if(componentClass)
					componentStartupCallback(component.name, 
						componentClass, component.config);
			}
			catch(e) {
				dumpError(e);
			}
		}).bind(this));
		S.emit("router:routing-finished");
	}
};

module.exports = Loader;