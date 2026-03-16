/**
 * @file contactRoutes.js
 * @author Levi Smith
 * 
 * discribes the message routes
 */

import express from 'express';
import {verifyToken} from './authRoutes.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/get-messages', verifyToken, async (req, res) => {

	if (!req.body || !req.userId || !req.body.id) {
		return res.status(400).json({message: 'Missing one or both IDs'});
	}

	const chatSize = (req.userId === req.body.id) ? 1 : 2;

	let chat = await Chat.findOne({
		participants: {
			$all: [req.userId, req.body.id],
			$size: chatSize
		}

	});

	//No chat exists yet
	if (!chat) {
		return res.status(200).json({ messages: [] });
	}

	const messages = await Message.find({chatId: chat._id}).sort({ createdAt: 1 });

	return res.status(200).json({messages});

});

export default router;