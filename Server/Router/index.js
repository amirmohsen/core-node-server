var 
	Express = require("express"),
	Vhost = require("vhost");

function Router(config) {
	this.config = config || {};
	this.init();
}

Router.prototype.init = function() {
	this._router = Express.Router();
	this._static = Express.static;

	console.log("Starting routing ...");

	S.once("all-components-loaded", this.serve.bind(this));
};

Router.prototype.serve = function() {

	for(var route in this.config.staticRoutes) {
		var dir = this.config.staticRoutes[route];
		if(Array.isArray(dir)) {
			for(var i=0; i<dir.length; i++) {
				this.serveDir(route, dir[i]);
			}
		}
		else
			this.serveDir(route, dir);
		
	}
	
	if(S.$.Server.config.appVhosts.length===0)
		this._router.use(Server.staticApp);
	else {
		S.$.Server.config.appVhosts.forEach((function (appVhost) {
			this._router.use(Vhost(appVhost, S.$.Server.staticApp));
		}).bind(this));			
	}

	// Resource not found
	this._router.use((function(req, res, next){
		res.status(404).sendFile(Path.join(__ROOT, "public/pages", this.config.errors.e404));
	}).bind(this));

	// Houston, we have a problem!
	this._router.use((function(err, req, res, next){
		dumpError(err);
		res.status(500).sendFile(Path.join(__ROOT, "public/pages", this.config.errors.e500));
	}).bind(this));
};

Router.prototype.serveDir = function(route, dir) {
	S.$.Server.staticApp.use(route, 
		this._static(Path.join(__ROOT, dir), S.$.Server.staticOpts));
};

module.exports = Router;