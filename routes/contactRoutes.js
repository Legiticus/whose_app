/**
 * @file contactRoutes.js
 * @author Levi Smith
 * 
 * discribes the contact routes
 */

import express from 'express';
import User from '../models/User.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

/**
 * Contact requests ('/api/contacts'):
 * POST /search - retreives the contacts with information (email, first name, last name) that matches the search term
 * GET /all-contacts - gets an object with a contacts array where each object contains the users full name and UID
 * GET /get-contacts-for-list - gets an object containing a contacts array sorted by time of last message
 * DELETE /delete-dm/:dmId - deleted the indicated DM
 **/

router.post('/search', verifyToken, async (req, res) => {
	
	if (!req.body || !req.body.searchTerm) {
		return res.status(400).json({message: 'Missing search term'});
	}

	const searchTerm = req.body.searchTerm;

	const users = await User.find({
		_id: { $ne: req.userId }, // Exclude current user
		$or: [
			{ email: { $regex: searchTerm, $options: 'i' } },
			{ firstName: { $regex: searchTerm, $options: 'i' } },
			{ lastName: { $regex: searchTerm, $options: 'i' } }
		]
	}).select('_id email firstName lastName color'); // Only fetch needed fields

	const resBody = {
		contacts: users
		.filter(u => u._id.toString() !== req.userId)
		.map(u => ({ 
			...u.toObject(), 
			_id: u._id.toString() 
		}))
	};

	return res.status(200).json(resBody);

});

router.get('/all-contacts', verifyToken, async (req, res) => {

	const users = await User.find({});

	const resBody = {
		contacts: users
		.filter(u => u._id.toString() !== req.userId)
		.map(user => ({
			label: user.firstName + ' ' + user.lastName,
			value: user._id.toString(),
			color: user.color
		}))
	};

	return res.status(200).json(resBody);
	
});

/**
 * GET /get-contacts-for-list
 * Retrieves all contacts sorted by their last message timestamp.
 */
router.get('/get-contacts-for-list', verifyToken, async (req, res) => {

	if (req.userId == null) {
		return res.status(400).json({message: 'userId not found'});
	}

	// Find all users and sort by lastMessageTime descending (-1)
	const users = await User.find({}).sort({ lastMessageTime: -1 });

	const resBody = {
		contacts: users
		.filter(u => u._id.toString() !== req.userId)
		.map(user => ({
			_id: user._id.toString(),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			image: user.image,
			color: user.color,
			lastMessageTime: user.lastMessageTime
		}))
	};

	return res.status(200).json(resBody);

});




export default router;