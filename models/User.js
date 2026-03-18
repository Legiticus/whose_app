/**
 * @file User.js
 * @author Levi Smith
 * 
 * Provides the schema for application users
 */


import mongoose from 'mongoose';

//User Schema
const userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	lastName: {type: String, default: ''},
	firstName: {type: String, default: ''},
	image: {type: String, default: ''},
	profileSetup: {type: Boolean, default: false},
	color: {type: String, default: ''},
	lastMessageTime: {type: Date, default: ''}

}, {timestamps: true});

export default mongoose.model('User', userSchema);