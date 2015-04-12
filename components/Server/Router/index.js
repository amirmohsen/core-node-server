var 
	Express = require("express");

function Router(config) {
	Router.config = config;
	this.init();
}

Router.prototype.init = function() {
	this._router = Express.Router();

	console.log("Starting routing ...");

	for(var route in Router.config.staticRoutes) {
		var location = Router.config.staticRoutes[route];
		Seed.$.Server.staticApp.use(route, 
			ServeStatic(Path.join(__ROOT, location), staticOpts));
	}
	
	if(Seed.$.config.appVhosts.length===0)
		Router._router.use(Server.staticApp);
	else {
		Seed.$.config.appVhosts.forEach(function (appVhost) {
			Router._router.use(Vhost(appVhost, Server.staticApp));
		});			
	}

	this.route = this._router.use;

	Seed.once("router:routing-finished", this.handleErrors.bind(this));
};

Router.prototype.handleErrors = function() {
	// Resource not found
	Router.router.use(function(req, res, next){
		res.status(404).sendFile(Path.join(__ROOT, "public", Router.config.e404));
	});

	// Houston, we have a problem!
	Router.router.use(function(err, req, res, next){
		dumpError(err);
		res.status(500).sendFile(Path.join(__ROOT, "public", Router.config.e500));
	});
};

module.exports = Router;