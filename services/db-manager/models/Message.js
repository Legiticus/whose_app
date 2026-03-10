import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
	chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
	senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	recipients: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
	content: {type: String, required: true},	 
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);