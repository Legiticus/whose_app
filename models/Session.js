import mongoose from 'mongoose';

//Session schema
const sessionSchema = new mongoose.Schema({
	UID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	token: {type: String, required: true},
	expiresAt: {type: Date, required: true},
	isValid: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('Session', sessionSchema);