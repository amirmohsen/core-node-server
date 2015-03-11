function API () {}

API.ERR_PREFIX = "API Error: ";

API.call = function(req, res, next) {

	try{
		var apiCall = URL.parse(req.url).pathname.substring(1).split(".");

		if(apiCall.length!==2)
			throw ERR_PREFIX + "Bad API call";

		var module = global[apiCall[0]];
	    if(module===undefined)
	    	throw ERR_PREFIX + "Module not found";

	    var method = module[apiCall[1]];
	    if(method===undefined)
	    	throw ERR_PREFIX + "Method not found";

	    var metadata = method.metadata;
	    if(metadata===undefined)
	    	throw ERR_PREFIX + "Metadata not found";

	    if(!metadata.remote)
	    	throw ERR_PREFIX + "Access denied. Method is not accessible remotely.";
		
		global[apiCall[0]][apiCall[1]](req, res, next);
	}
	catch(e){
		dumpError(e);
		next();
	}
}

module.exports = API;