import mongoose from 'mongoose';

const channelMessageSchema = mongoose.Schema({
	chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
	senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	recipients: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
	content: {type: String, required: true},
	messageType: {type: String, enum: ['text', 'file', 'image'], default: 'text'},
}, {timestamps: true});

export default mongoose.model('ChannelMessage', channelMessageSchema);