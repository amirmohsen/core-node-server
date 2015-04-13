var
	Consolidate = require("consolidate"),
	Handlebars = require("handlebars");

function TemplateEngine(config) {
	this.config = config;
	this.init();
}

TemplateEngine.prototype.init = function() {
	
};

module.exports = TemplateEngine;