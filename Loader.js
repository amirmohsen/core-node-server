var Loader = {

	index: -1,

	config: function() {
		var config = JSON.parse(
			FS.readFileSync(__ROOT + "/config.json", { encoding: "utf-8" })
		);
		Seed.config = config.core;
		App.config = config.app;
		return Loader;
	};

	load: function(run) {
		Loader.index++;
		if(Loader.index < Seed.Config.components.length) {
			try {
				var name = Seed.Config.components[Loader.index];
				if(name)
					run(name, require("./components/" + name));
			}
			catch(e) {
				dumpError(e);
			}
			Loader.load(createCallback);
		}
	};
}

module.exports = Loader;