function API (config) {
	this.config = config;
	this.init();
}

API.BAD_CALL_ERR = "API Error: Bad API call";

API.prototype.init = function() {
	S.$.Server.route("/_api", this.call.bind(this));
};

API.prototype.call = function(req, res, next) {
	try{
		var
			apiCall = URL.parse(req.url).pathname.substring(1).split("."),
			caller = null,
			call = null;

		if(apiCall.length < 2)
			throw API.BAD_CALL_ERR;

		apiCall.forEach((function(callPiece, index) {
			if(index === 0)
				caller = global[callPiece];
			else {
				caller = call;
				call = caller[callPiece];
			}
			
			if( (!call && index > 0) || !caller)
				throw API.BAD_CALL_ERR;
		}).bind(this));

		if(!caller || !caller._meta || !caller._meta.api 
			|| !call || !call._meta || !call._meta.remotable)
			throw API.BAD_CALL_ERR;

		call.call(caller, req, res, next);
	}
	catch(e){
		dumpError(e);
		res.status(500).send(e);
	}
}

module.exports = API;