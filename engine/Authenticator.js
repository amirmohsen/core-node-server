function Authenticator() {}

Authenticator.letmepass = function(allowedPaths) {
	allowedPaths.forEach(function(allowed){
		Router.router.use(allowed, function(req, res, next){
			req.noAuthReq = true;
			next();
		})
	});
}

Authenticator.setup = function() {

	Server.app.use(Passport.initialize());
	Server.app.use(Passport.session());
	Server.app.use(Flash());

	// used to serialize the user for the session
	Passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	Passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	Passport.use(
		'local-login', 
		new LocalStrategy({
			passReqToCallback : true,
			usernameField: 'email',
			passwordField: 'password'
		},
		function(req, email, password, done) {

			User.findOne({ email: email }, function(err, user) {
				// if there are any errors, return the error before anything else
				if (err)
					return done(err);

				// if no user is found, return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

				// if the user is found but the password is wrong
				if (!user.isValidPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

				// all is well, return successful user
				return done(null, user);
			});

		})
	);
};

Authenticator.guard = function() {
	Router.router.post("/login", Passport.authenticate('local-login', {
		successRedirect : Config.appPath+"/",
		failureRedirect : Config.appPath+"/login.html",
			failureFlash : true // allow flash messages
		}));

	Router.router.use('/logout', function(req, res){
		req.logout();
		res.redirect(Config.appPath+"/login.html");
	});

	Router.router.use("/login", function(req, res, next) {
		res.redirect(Config.appPath+"/login.html");
	});

	Router.router.use("/login.html", function(req, res, next){
		if(req.isAuthenticated())
			res.redirect(Config.appPath+"/");
		else
			next();
	});

	Authenticator.letmepass([
		"/logout",
		"/login.html",
		"/styles",
		"/fonts",
		"/scripts"
		]);

	Router.router.use("/", function(req, res, next){
		if (req.noAuthReq || req.isAuthenticated())
			next();
		else
			res.redirect(Config.appPath+"/login.html");
	});
};

module.exports = Authenticator;