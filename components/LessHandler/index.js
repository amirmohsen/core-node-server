var LessMiddleware = require("less-middleware");

function LessHandler (config) {
	this.config = config;
	this.init();
}

LessHandler.prototype.init = function() {
	S.$.Server.route(
		LessMiddleware(
			Path.join(__ROOT, this.config.src), 
			{
				dest: Path.join(__ROOT, this.config.dest),
				compiler: {
					compress: false,
					sourceMap: true
				},
				preprocess: {
					less: function(src, req){
						src = "@appPath: \"" +
								S.$.Server.config.appPath + "\";\n" + src;
															
						return src;
					}
				}
			}
		)
	);
};

module.exports = LessHandler;