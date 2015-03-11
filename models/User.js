var userSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.methods.generateHash = function(password) {
    return BCrypt.hashSync(password, BCrypt.genSaltSync(8), null);
};

userSchema.methods.isValidPassword = function(password) {
    return BCrypt.compareSync(password, this.password);
};

module.exports = Model('User', userSchema);