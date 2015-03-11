function LessHandler() {}

LessHandler.compile = function() {
	Router.router.use(
		LessMiddleware(
			Path.join(__ROOT, "app/views"), 
			{
				dest: Path.join(__ROOT, "public"),
				compiler: {
					compress: false,
					sourceMap: true
				},
				preprocess: {
					less: function(src, req){
						src = "@appPath: \"" +
								Config.appPath + "\";\n" +
								src;
															
						return src;
					}
				}
			}
		)
	);
};

module.exports = LessHandler;