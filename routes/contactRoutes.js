/**
 * @file contactRoutes.js
 * @author Levi Smith
 * 
 * discribes the contact routes
 */

import express from 'express';
import User from '../models/User';

const router = express.Router();

/**
 * Contact requests ('/api/contacts'):
 * POST /search - retreives the contacts with information (email, first name, last name) that matches the search term
 * GET /all-contacts - gets an object with a contacts array where each object contains the users full name and UID
 * GET /get-contacts-for-list - gets an object containing a contacts array sorted by time of last message
 * DELETE /delete-dm/:dmId - deleted the indicated DM
 **/

router.post('/search', async (req, res) => {
	
	if (!req.body || !req.body.searchTerm) {
		res.status(400).json({message: 'Missing search term'});
	}

	//Generate a regular expression for searching
	const regex = new RegExp(req.body.searchTerm);

	return res.status(200).json({message: 'Debug'});
	const users = await User.find({
		$or: [
			{ email: { $regex: searchTerm, $options: 'i' } },
			{ firstName: { $regex: searchTerm, $options: 'i' } },
			{ lastName: { $regex: searchTerm, $options: 'i' } }
		]
	});

	const resBody = {
		contacts: []
	};


	//loop through results and push to contacts
	users.forEach(user => {
		resBody.contacts.push({
			id: user._id,
			email: user.email,
			lastName: user.lastName,
			firstName: user.firstName
		});
	});

	return res.status(200).json(resBody);

});

export default router;