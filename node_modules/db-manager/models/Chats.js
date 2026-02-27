const mongoose = require('mongoose');

//Chat schema
const chatSchema = mongoose.Schema({
	participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	isDeleted: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('Chat', chatSchema);