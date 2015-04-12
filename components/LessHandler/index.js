var LessMiddleware = require("less-middleware");

function LessHandler () {
	this.init();
}

LessHandler.prototype.init = function() {
	Silk.$.Server.router.route(
		LessMiddleware(
			Path.join(__ROOT, LessHandler.config.src), 
			{
				dest: Path.join(__ROOT, LessHandler.config.dest),
				compiler: {
					compress: false,
					sourceMap: true
				},
				preprocess: {
					less: function(src, req){
						src = "@appPath: \"" +
								Silk.$.Server.config.appPath + "\";\n" + src;
															
						return src;
					}
				}
			}
		)
	);
};