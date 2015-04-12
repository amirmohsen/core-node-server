var Loader = {

	globalModules: {
		EventEmitter: "events",
		FS: "fs-extra",
		Path: "path",
		Util: "util"
	},

	globalize: function() {
		for(var module in globalModules) {
			global[module] = require(globalModules[module]);
		}
		return Loader;
	},

	config: function() {
		var config = require(Path.join(__ROOT, "/config"));		
		Seed.config = config.core;
		App.config = config.app;		
		return Loader;
	},

	load: function(componentStartupCallback) {
		Seed.config.components.forEach((function(component) {
			try {
				var componentClass = require(Path.join("./components/", component.name));
				if(componentClass) {
					componentClass.config = component.config;
					componentStartupCallback(component, componentClass);
				}
			}
			catch(e) {
				dumpError(e);
			}
		}).bind(this));
		Seed.emit("router:routing-finished");
	}
}

module.exports = Loader;