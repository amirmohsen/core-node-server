function DB() {}

DB.connect = function(fireUp) {
	Mongoose.connect("mongodb://" +
		Config.database.user + ":" +
		Config.database.pass + "@" +
		Config.database.host + ":" + 
		Config.database.port + "/" +
		Config.database.name
		);
	db = Mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', fireUp);
};

module.exports = DB;