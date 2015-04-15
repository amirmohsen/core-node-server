var
	Cheerio = require("cheerio"),
	Hogan = require("hogan.js"),
	HTMLBeautify = require('js-beautify').html;


function TemplateEngine(config) {
	this.config = config;
	this.init();
}

TemplateEngine.prototype.init = function() {

	this.preCompile = false;
	this.fsOps = { encoding: "utf-8" };

	if(S.$.Server.app.get("env") === "production")
		this.preCompile = true;

	S.$.Server.app.engine("html", this.glue.bind(this));
	S.$.Server.app.set("view engine", ".html");
	S.$.Server.app.set("views", Path.join(__ROOT, "data/pages"));

	S.$.Server.route("/", function(req, res) {
		res.render("index", {test: "marooncanvas.js"});
	});
};

TemplateEngine.prototype.glue = function(filePath, options, callback) {
	FS.readFile(filePath, this.fsOps, (function (err, content) {
		
		if (err)
			return callback(new Error(err));

		var $ = {
				options: options,
				callback: callback,
				page: Cheerio.load(content)
			};

		this.loadLayout($);

	}).bind(this));
};

TemplateEngine.prototype.loadLayout = function($) {
	var 
		$layoutImporter = $.page("link[rel='import'][layout]"),
		layoutPath = $layoutImporter.attr("href");

		$layoutImporter.remove();

	FS.readFile(
		Path.join(__ROOT, this.config.layouts, layoutPath),
		this.fsOps,
		(function (err, content) {

			if (err)
				return $.callback(new Error(err));

			$.doc = Cheerio.load(content);

			$.doc("link[rel='import'][page]").replaceWith($.page.html());

			this.importMixins($);

		}).bind(this)
	);
};

TemplateEngine.prototype.importMixins = function($) {

	var
		$mixins = $.doc("link[rel='import'][mixin]"),
		total = $mixins.length,
		count = 0;

	$mixins.each((function(index, element) {
		var 
			$mixinImporter = $.doc(element),
			mixinPath = $mixinImporter.attr("href");

		FS.readFile(
			Path.join(__ROOT, this.config.mixins, mixinPath),
			this.fsOps,
			(function (err, content) {

				if (err)
					return $.callback(new Error(err));

				$mixinImporter.replaceWith(content);

				count++;

				if(total === count)
					this.gluePieces($);

			}).bind(this)
		);
	}).bind(this));
	
};

TemplateEngine.prototype.gluePieces = function($) {

	$.doc("template[ref]").each(function(index, element) {
		var
			$templateRef = $.doc(element),
			refs = $templateRef.attr("ref").split(":", 2);

		var $templateSrc = $.doc("template[id^='" + refs[0] + "']");

		if(refs[1])
			$templateSrc = $templateSrc.find("template#" + refs[1]);

		$templateRef.replaceWith($templateSrc.html());
	});

	$.doc("template").remove();

	this.replaceVars($);
};

TemplateEngine.prototype.replaceVars = function($) {
	
	var rendered = HTMLBeautify(
		Hogan.compile($.doc.html()).render($.options),
		{
			indent_size: 1,
			indent_char: "	",
			preserve_newlines: false
		}
	);

	return $.callback(null, rendered);
};

module.exports = TemplateEngine;