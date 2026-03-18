/**
 * @file Chat.js
 * @author Levi Smith
 * 
 * Provides the schema for chats
 */

import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
	participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	isDeleted: {type: Boolean, default: false}
}, {timestamps: true});

export default mongoose.model('Chat', chatSchema);