var 
	HTTP = require("http"),
	HTTPS = require("https"),
	Express = require("express"),
	BodyParser = require("body-parser")
	Compression = require("compression"),
	CookieParser = require("cookie-parser"),
	ForceSSL = require("express-force-ssl"),
	Multer = require("multer"),
	Router = require("./Router");

function Server(config) {
	Seed.Component.call(this, "Server");
	this.config = config || {};
	this.init();
}

Util.inherits(Server, Seed.Component);

Server.prototype = {

	init: function() {
		this.app = Express();
		this.app.set("env", this.config.env);
		this.staticApp = Express();
		this.httpServer = HTTP.createServer(this.app);
		this.httpsServer = null;
		this.staticOpts = { maxAge: this.config.cache };

		if(this.config.proxy) {			
			this.httpServer.listen(this.config.proxyPort);
		}
		else {
			var httpsOptions = {
				key: FS.readFileSync(Path.join(__ROOT, this.config.ssl.key)),
				cert: FS.readFileSync(Path.join(__ROOT, this.config.ssl.cert))
			};

			this.httpsServer = HTTPS.createServer(httpsOptions, this.app);
			this.httpServer.listen(this.config.httpPort);
			this.httpsServer.listen(this.config.httpsPort);

			// Force redirects all http requests to https
			this.app.use(ForceSSL);
		}

		// Compress all responses above 1KB (default value)
		this.app.use(Compression());

		// Handles cookies
		this.app.use(CookieParser());
		
		// Handles json-encoded data
		this.app.use(BodyParser.json());

		// Handles url-encoded data
		this.app.use(BodyParser.urlencoded({
			extended: true
		}));

		// Handles multipart data, particularly file uploads
		this.app.use(Multer({
			dest: Path.join(__ROOT, "temp"),
			includeEmptyFields: true
		}));
	},

	run: function() {
		this.router = new Router(this.config.Router);
		this.app.use(this.config.appPath, this.router._router);
		console.log("Server is running ...");
	},

	route: function() {
		this.router._router.use.apply(this.router._router, arguments);
	}
};

module.exports = Server;