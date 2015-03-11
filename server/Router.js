function Router () {}

Router.router = Express.Router();

Router.route = function() {

	console.log("Starting routing ...");

	// Less compilation
	LessHandler.compile();

	// Needs date and time modified
	Router.router.use("/", function(req, res, next){
		PageBuilder.buildOne(URL.parse(req.url).pathname);
		next();
	});

	Authenticator.guard();

	if(Config.appVhosts.length===0)
		Router.router.use(Server.staticApp);
	else {
		Config.appVhosts.forEach(function (appVhost) {
			Router.router.use(Vhost(appVhost, Server.staticApp));
		});			
	}

	// Handle API calls
	Router.router.use("/_api", API.call);

	ErrorHandler.badRequests();
};

module.exports = Router;