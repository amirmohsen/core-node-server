function Main(appRoot) {

	try {

		console.log("Loading modules & configuration ...");
		global.__ROOT = appRoot;
		require("./Loader.js").load();

		console.log("Building all pages ...");
		PageBuilder.options = {
			globals: {
				appPath: Config.appPath
			}
		};
		PageBuilder.buildAll();

		console.log("Configuring server ...");
		Server.configure();

		console.log("Connecting to database ...");
		DB.connect(function(){
			console.log("Database is connected ...");
			Server.run();
		});

	}
	catch(error){
		dumpError(error);
	}
}

global.dumpError = function(err) {
	if (typeof err === 'string')
		console.error(err);
	else if (typeof err === 'object') {
		if (err.message) {
			console.error('\nMessage: ' + err.message)
		}
		if (err.stack) {
			console.error('\nStacktrace:')
			console.error('====================')
			console.error(err.stack);
		}
	}
}

module.exports = Main;