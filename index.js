var globalModules = require("./global_modules");

for(var module in globalModules) {
	global[module] = require(globalModules[module]);
}

// Core
var Seed = require("./Core");

global.Seed = Seed;

// Abstract
Seed.Component = require("./Abstract/Component");

// Components
Seed.API = require("./API");
Seed.LessHandler = require("./LessHandler");
Seed.Server = require("./Server");
Seed.TemplateEngine = require("./TemplateEngine");

global.dumpError = function(err) {
	if (typeof err === 'string')
		console.error(err);
	else if (typeof err === 'object') {
		if (err.message) {
			console.error('\nMessage: ' + err.message)
		}
		if (err.stack) {
			console.error('\nStacktrace:')
			console.error('====================')
			console.error(err.stack);
		}
	}
}