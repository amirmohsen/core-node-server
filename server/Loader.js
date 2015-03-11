function Loader(){}

Loader.importer = function(list) {

	var FS = require("fs"),
		Path = require("path");

	if(list.dirs){
		list.dirs.forEach(function loadFileModules(dir){
			var contents = FS.readdirSync(dir);
			contents.forEach(function(content){
				var path = Path.join(dir,content);
				var stats = FS.statSync(path);
				if(stats.isDirectory())
					loadFileModules(path);
				else if(stats.isFile() &&
						Path.extname(path) === ".js"){
					var moduleName = Path.basename(path,".js");
					global[moduleName] = require(path);
				}
			});
		});
	}

	if(list.packages){
		for(var packageName in list.packages){
			var packageLabel = list.packages[packageName];
			global[packageLabel] = require(packageName);
		}
	}
};

Loader.midprocess = function() {
	global.Schema = Mongoose.Schema;
	global.Model = function(name, schema){
		return Mongoose.model(name, schema);
	};
	global.LocalStrategy = PassportLocal.Strategy;	
};

Loader.external = function() {
	// Real name of the module vs name to be used in the app
	Loader.importer({
		packages: {
			"bcrypt-nodejs": "BCrypt",
			"body-parser": "BodyParser",
			"change-case": "ChangeCase",
			"cheerio": "Cheerio",
			"compression": "Compression",
			"connect-flash": "Flash",
			"cookie-parser": "CookieParser",
			"express": "Express",
			"express-force-ssl": "ForceSSL",
			"express-session": "Session",
			"fs-extra": "FS",
			"http": "HTTP",
			"https": "HTTPS",
			"js-beautify": "JSBeautify",
			"less-middleware": "LessMiddleware",
			"mongoose": "Mongoose",
			"multer": "Multer",
			"mustache": "Mustache",
			"node-uuid": "UUID",
			"passport": "Passport",
			"passport-local": "PassportLocal",
			"path": "Path",
			"serve-static": "ServeStatic",
			"url": "URL",
			"url-join": "URLJoin",
			"vhost": "Vhost"
		}
	});
};

Loader.internal = function() {
	Loader.importer({
		dirs: [
			__ROOT + "/app",
			__ROOT + "/core"
		]
	});
};

Loader.config = function() {

	global.Config = JSON.parse(
		FS.readFileSync(__ROOT + "/config.json", { encoding: "utf-8" })
	);
};

Loader.load = function() {

	Loader.external();
	Loader.midprocess();
	Loader.internal();
	Loader.config();
};

module.exports = Loader;