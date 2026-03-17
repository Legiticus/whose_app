/**
 * @file authRoutes.js
 * @author Levi Smith
 * 
 * discribes the authentiction routes
 */

import express from "express";
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


/**
 * Account routes ('/api/account'):
 * POST /signup - signs up a new user
 * POST /login - logs a the existing user in
 * POST /logout - logs the user out
 * GET /userinfo - gets the requesting users info
 * POST /update-profile - updates the requesting users profile
 **/



//HELPER FUNCTIONS

/**
 * Middleware: verify token
 * Extracts the jwt from the jwt cookie and
 * attaches it to the request.
 * - If missing, returns 401 (Unauthorized).
 * - If invalid or expired, returns 403 (Forbidden).
 * - If unknown error occurs, returns 500 (Internal Server Error)
 * - If valid, extracts `userId` from the payload and attaches it to `req.userId`.
 */
export function verifyToken(req, res, next) {
	try {
		console.log('verifying requestors token');
		const token = req.cookies.jwt;
  		if (!token) {
			console.log('token not found');
			return res.status(401).json({ message: "Not authenticated" });
		} 

		jwt.verify(token, process.env.SECRET_KEY || 'Testkey', (err, payload) => {
			console.log('checking for token error')
			if (err) {
				console.log("Token Error: invalid or expired token");
				return res.status(403).json({ message: "Invalid or expired token" });
			}
			console.log(`Token verified for email: ${payload.email} (ID: ${payload.userId})`);
			req.userId = payload.userId;
			next();
		});
	}catch (error) {
		console.log("Error verifying token: ", error);
		return res.status(500).json({message: 'Internal Server Error'});
	}
}



//SIGNUP
router.post('/signup', async (req, res) => {

	try {

		if (!req.body || !req.body.email || !req.body.password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		const {email, password} = req.body

		//Hash password before sending to database
		const hashedPass = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));;

		if (await User.findOne({email})) {
			return res.status(409).json({message: "Email already registered"});
		}

		const user = await User.create({
			email,
			password: hashedPass
		});

		//Verify User
		res.clearCookie("jwt", { secure: true, sameSite: "None" }); // Clear old first

		const token = jwt.sign({email, userId: user._id}, process.env.SECRET_KEY || 'Testkey', {expiresIn: "1h"});

		res.cookie('jwt', token, {
			secure: true, // Ensures that the cookie is only sent over HTTPS (important in production but often ignored over local host)
			sameSite: "None", // Allows for cross-origin cookies when using credentials
			maxAge: 60*60*1000 // Expires in 1h
		});

		//Create respose body and send response
		const resBody = {
			message: 'User registered successfully',
			user: {
				id: user._id,
				email: user.email,
				lastName: user.lastName,
				firstName: user.firstName,
				image: user.image,
				profileSetup: user.profileSetup
			}
		}

		res.status(201).json(resBody);
	

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

//LOGIN
router.post('/login', async (req, res) => {

	try {

		if (!req.body || !req.body.email || !req.body.password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		const {email, password} = req.body;

		const user = await User.findOne({email});

		if (!(user)) {
			return res.status(404).json({message: "No user found with the given email"});
		}

		const validPass = await bcrypt.compare(password, user.password);

		if (!validPass) {
			return res.status(400).json({message: "Invalid password"});
		}

		//Verify user with token
		res.clearCookie("jwt", { secure: true, sameSite: "None" }); // Clear old first

		const token = jwt.sign({email, userId: user._id}, process.env.SECRET_KEY || 'Testkey', {expiresIn: "1h"});

		res.cookie("jwt", token, {
			secure: true, // Ensures the cookie is only sent over HTTPS (important in production but often ignored over local host)
			sameSite: "None", // Allows cross-origin cookies when using credentials
			maxAge: 60 * 60 * 1000, // 1 hour expiration
		})

		const resBody = {
			message: 'User login successful',
			user: {
				id: user._id,
				email: user.email,
				lastName: user.lastName,
				firstName: user.firstName,
				image: user.image,
				profileSetup: user.profileSetup,
				color: user.color
			}
		}

		res.status(200).json(resBody);
	
	}catch (error) {
		console.error('Login Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}

});

//LOGOUT
router.post('/logout', verifyToken, async (req, res) => {
	res.clearCookie('jwt', {
		secure: true,
		sameSite: "None"
	});
	return res.status(200).json('Logout successful');
});

//GET USER INFO
router.get('/userinfo', verifyToken, async (req, res) => {

	//Check if userId is in the body
	if (req.userId == null) {
		console.log('Get Info Error: UserID not in token');
		return res.status(404).json({message: 'UserID not in token'});
	}

	//Find
	const user = await User.findById(req.userId);
	if (!user) {
		return res.status(404).json({message: 'User not in database'});
	}
	const resBody = {
		id: user._id,
		email: user.email,
		lastName: user.lastName,
		firstName: user.firstName,
		image: user.image,
		profileSetup: user.profileSetup,
		color: user.color
	}

	return res.status(200).json(resBody);

});

//UPDATE USER PROFILE
router.post('/update-profile', verifyToken, async (req, res) => {

	if (req.userId == null) {
		console.log('Update Profile Error: UserID not in token');
		return res.status(400).json({message: 'UserID not in token'});
	}

	if ( req.body.lastName == null || req.body.firstName == null) {
		console.log('Update Profile Error: User failed to provide all info for required fields');
		return res.status(400).json({message: 'Missing required fields'});
	}

	console.log(`Updating user profile: id=${req.userId}, firstName=${req.body.firstName}`);

	//find user
	const user = await User.findById(req.userId);
	if (!user) {
		console.log('Update Info Error: User not in database');
		return res.status(404).json({message: 'User not in database'});
	}

	user.lastName = req.body.lastName;
	user.firstName = req.body.firstName;
	user.color = req.body.color;
	user.profileSetup = true;

	await user.save();

	const resBody = {
		id: user._id,
		email: user.email,
		lastName: user.lastName,
		firstName: user.firstName,
		image: user.image,
		profileSetup: user.profileSetup,
		color: user.color,
		message: 'User profile updated successfully'
	}

	return res.status(200).json(resBody);

});

export default router;