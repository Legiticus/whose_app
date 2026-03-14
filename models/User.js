import mongoose from 'mongoose';

//User Schema
const userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	lastName: String,
	firstName: String,
	image: String,
	profileSetup: {type: Boolean, default: false},
	color: String

}, {timestamps: true});

export default mongoose.model('User', userSchema);