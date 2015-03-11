function ErrorHandler() {}

ErrorHandler.badRequests = function() {
	// Resource not found
	Router.router.use(function(req, res, next){
		res.status(404).send("Sorry can't find that!");
	});

	// Houston, we have a problem!
	Router.router.use(function(err, req, res, next){
		dumpError(err);
		res.status(500).send('Something broke!');
	});
};

module.exports = ErrorHandler;