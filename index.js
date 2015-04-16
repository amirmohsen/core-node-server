var Seed = function() {
	return require("./Core");
};

// Abstract
Seed.Component = require("./Abstract/Component");

// Components
Seed.API = require("./API");
Seed.LessHandler = require("./LessHandler");
Seed.Server = require("./Server");
Seed.TemplateEngine = require("./TemplateEngine");

module.exports = Seed;