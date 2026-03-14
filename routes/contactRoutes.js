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

router.post('/search', (req, res) => {
	return non;
});