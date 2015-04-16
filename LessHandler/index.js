var LessMiddleware = require("less-middleware");

function LessHandler (config) {
	Seed.Component.call(this);
	this.config = config || {};
}

Util.inherits(LessHandler, Seed.Component);

LessHandler.prototype.run = function() {
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