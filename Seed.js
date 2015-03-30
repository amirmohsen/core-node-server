var Seed = {

	__ROOT: "",

	$: {},

	Loader: require("./Loader.js"),

	start: function(appRoot) {
		console.log("Loading modules & configuration ...");	
		Seed.__ROOT = appRoot;
		Seed.Loader.config().load(Seed.run);
	},

	run: function(name, Component) {
		Seed.$[name] = new Component();
	}
}

module.exports = Seed;