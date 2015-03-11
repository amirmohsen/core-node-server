function UserManager() {}

UserManager.initialUserCreation = function() {
	if(
		Config.createUser &&
		Config.createUser.firstname &&
		Config.createUser.lastname &&
		Config.createUser.email &&
		Config.createUser.password
		) {
		UserManager.__create(
			Config.createUser,
			function(){
				console.log("Initial user created. Please remove it from the config file.");	
			},
			function(){
				console.error("Initial user creation failed.");
			}
		);				
	}
};

UserManager.create = function(req, res){

    var reqBody = req.body;

    if(Object.keys(reqBody).length === 0
        || !reqBody.userEmail){
        console.error("missing params");
        return res.send("false");
    }

    var userProps = {
        firstname: reqBody.userFirstname,
        lastname: reqBody.userLastname,
        email: reqBody.userEmail,
        password: reqBody.userPassword
    };

    UserManager.__create(
        userProps,
        function(){
            res.send("true");
        },
        function(){
            res.send("false");
        }
    );
}

UserManager.create.metadata = {
    remote: true
};

UserManager.__create = function(props, success, failure) {

    success = success || function(){};
    failure = failure || function(){};

    User.findOne({ email: props.email }, function(err, user) {

        if (err){
            dumpError(err);
            return failure();
        }

        if (user) {
            console.error("existing user");
            return failure();
        }
        else {

            user = new User();

            user.firstname = props.firstname;
            user.lastname = props.lastname;
            user.email = props.email;
            user.password = user.generateHash(props.password);

            if(
                !user.firstname || 
                !user.lastname ||
                !user.email ||
                !user.password
                ){
                return failure();
            }

            user.save(function(err){
                if(err){
                    dumpError(err);
                    return failure();
                }
                else
                    return success();
            });
        }
    });
};

UserManager.whoAmI = function(req, res) {
    var response = "";
    if(req.user)
        response = req.user.firstname + " " + req.user.lastname;
    res.send(response);
};

UserManager.whoAmI.metadata = {
    remote: true
};

module.exports = UserManager;