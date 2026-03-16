import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
	chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	content: {type: String, required: true},
	messageType: {type: String, enum: ['text', 'file', 'image'], default: 'text'},
}, {timestamps: true});

export default mongoose.model('Message', messageSchema);