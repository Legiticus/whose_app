/**
 * @file contactRoutes.js
 * @author Levi Smith
 * 
 * discribes the message routes
 */

import express from 'express';
import {verifyToken} from './authRoutes.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/get-messages', verifyToken, async (req, res) => {

	if (!req.body || !req.userId || !req.body.id) {
		return res.status(400).json({message: 'Missing one or both IDs'});
	}

	if (req.userId === req.body.id) {
		console.log(`User attempted to query messages with themselves: userId=${req.userId}, id=${req.body.id}`);
		return res.status(403).json('Forbidden: User attempted to query messages with themselves');
	}

	const requestor = new mongoose.Types.ObjectId(req.userId);
	const requestee = new mongoose.Types.ObjectId(req.body.id);

	let chat = await Chat.findOne({
		participants: {
			$all: [requestor, requestee],
			$size: 2
		}
	});

	//No chat exists yet
	if (!chat) {
		return res.status(200).json({ messages: [] });
	}

	const messages = await Message.find({chatId: chat._id}).sort({ createdAt: 1 });

	console.log(`Requestor: ${requestor}, Requestee: ${requestee}`);
	console.log(`ChatID=${chat._id}`);

	return res.status(200).json({messages});

});

export default router;