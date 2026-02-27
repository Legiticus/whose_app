const mongoose = require('mongoose');

//User Schema
const userSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	profile: {
		lastName: String,
		firstName: String
	}

}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);