function Server() {}

Server.configure = function() {

	if(Config.proxy) {			
		Server.httpServer.listen(Config.proxyPort);
	}
	else {
		var httpsOptions = {
			key: FS.readFileSync(Config.ssl.key),
			cert: FS.readFileSync(Config.ssl.cert)
		};

		Server.httpsServer = HTTPS.createServer(httpsOptions, Server.app);
		Server.httpServer.listen(Config.httpPort);
		Server.httpsServer.listen(Config.httpsPort);

		// Force redirects all http requests to https
		Server.app.use(ForceSSL);
	}
};

Server.run = function() {

	// Compress all responses above 1KB (default value)
	Server.app.use(Compression());

	var staticOpts = {maxAge: Config.cache};

	Server.staticApp.use("/",ServeStatic('public', staticOpts));

	// This is to serve less files for source mapping
	Server.staticApp.use("/styles",ServeStatic('app/views/styles', staticOpts));

	// Assets
	Server.staticApp.use("/scripts",ServeStatic('assets/scripts', staticOpts));
	Server.staticApp.use("/fonts",ServeStatic('assets/fonts', staticOpts));

	// Samaritan UI in the true style of Person of Interest
	Server.staticApp.use("/samaritan-poi-ui",ServeStatic('samaritan-poi-ui', staticOpts));

	// Handles cookies
	Server.app.use(CookieParser());
	
	// Handles json-encoded data
	Server.app.use(BodyParser.json());

	// Handles url-encoded data
	Server.app.use(BodyParser.urlencoded({
		extended: true
	}));

	// Handles multipart data, particularly file uploads
	Server.app.use(Multer({
		dest: './temp/',
		includeEmptyFields: true
	}));

	Server.app.use(Session({ 
		secret: "samaritan-login-session-secret",
		saveUninitialized: true,
		resave: true 
	}));

	Authenticator.setup();

	Router.route();

	Server.app.use(Config.appPath, Router.router);

	UserManager.initialUserCreation();

	console.log("Server is running ...");
};

module.exports = Server;