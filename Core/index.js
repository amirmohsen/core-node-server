function Main(config) {
	try {
		global.A = {};
		global.S = new (require("./Seed"))(config);
		S.run();
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