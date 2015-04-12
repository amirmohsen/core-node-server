var 
	HTTP = require("http"),
	HTTPS = require("https"),
	Express = require("express"),
	Router = require("./Router");

function Server() {
	this.init();
}

Server.prototype.init = function() {
	this.app = Express();
	this.staticApp = Express();
	this.httpServer = HTTP.createServer(this.app);
	this.httpsServer = null;
	this.staticOpts = {maxAge: Server.config.cache};

	if(Server.config.proxy) {			
		this.httpServer.listen(Server.config.proxyPort);
	}
	else {
		var httpsOptions = {
			key: FS.readFileSync(Path.join(__ROOT, Server.config.ssl.key)),
			cert: FS.readFileSync(Path.join(__ROOT, Server.config.ssl.cert))
		};

		this.httpsServer = HTTPS.createServer(httpsOptions, this.app);
		this.httpServer.listen(Server.config.httpPort);
		this.httpsServer.listen(Server.config.httpsPort);

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

	this.router = new Router(Server.config.Router);

	this.app.use(Config.appPath, this.router._router);

	console.log("Server is running ...");
};

module.exports = Server;