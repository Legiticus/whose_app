import mongoose from 'mongoose';

//Chat schema
const chatSchema = mongoose.Schema({
	participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	isDeleted: {type: Boolean, default: false}
}, {timestamps: true});

export default mongoose.model('Chat', chatSchema);