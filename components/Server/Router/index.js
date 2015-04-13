var 
	Express = require("express"),
	ServeStatic = require("serve-static"),
	Vhost = require("vhost");

function Router(config) {
	this.config = config;
	this.init();
}

Router.prototype.init = function() {
	this._router = Express.Router();

	console.log("Starting routing ...");

	for(var route in this.config.staticRoutes) {
		var location = this.config.staticRoutes[route];
		S.$.Server.staticApp.use(route, 
			ServeStatic(Path.join(__ROOT, location), S.$.Server.staticOpts));
	}
	
	if(S.$.Server.config.appVhosts.length===0)
		this._router.use(Server.staticApp);
	else {
		S.$.Server.config.appVhosts.forEach((function (appVhost) {
			this._router.use(Vhost(appVhost, S.$.Server.staticApp));
		}).bind(this));			
	}

	S.once("router:routing-finished", this.handleErrors.bind(this));
};

Router.prototype.handleErrors = function() {
	// Resource not found
	this._router.use(function(req, res, next){
		res.status(404).sendFile(Path.join(__ROOT, "public", this.config.e404));
	});

	// Houston, we have a problem!
	this._router.use(function(err, req, res, next){
		dumpError(err);
		res.status(500).sendFile(Path.join(__ROOT, "public", this.config.e500));
	});
};

module.exports = Router;