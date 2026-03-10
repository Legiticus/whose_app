import express from "express";

import User from '../models/User.js';

const router = express.Router();

//SIGNUP
router.post('/signup', async (req, res) => {

	try {

		const {email, password} = req.body;

		//also checked by authentication service
		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		if (await User.findOne({email})) {
			return res.status(409).json({message: "Email already registered"});
		}

		const user = await User.create({
			email,
			password
		});

		const resBody = {
			message: 'User registered successfully',
			user: {
				id: user._id,
				password: user.password,
				lastName: user.lastName,
				firstName: user.firstName,
				image: user.image,
				profileSetup: user.profileSetup,
				color: user.color
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

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		//also checked by authentication service
		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		const user = await User.findOne({email});

		if (!(user)) {
			return res.status(404).json({message: "No user found with the given email"});
		}

		if (user.password != password) {
			return res.status(400).json({message: "Invalid password"});
		}

		const resBody = {
			message: 'User registered successfully',
			user: {
				id: user._id,
				password: user.password,
				lastName: user.lastName,
				firstName: user.firstName,
				image: user.image,
				profileSetup: user.profileSetup,
				color: user.color
			}
		}

		res.status(201).json(resBody);
	

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}

});

//GET USER INFO
router.get('/userinfo', async (req, res) => {
	try {

		//Check if userId is in the body
		if (req.body.userId == null) {
			console.log('Get Info Error: UserID not in request body');
			return res.status(404).json({message: 'UserID not in request body'});
		}

		//find user
		const user = User.findById(req.body.userId);
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

	} catch (error) {
		console.log('Get Info Error: ', error);
		return res.status(500).json({message: 'Internal Server Error'});
	}
});

//UPDATE USER PROFILE
router.post('/update-profile', async (req, res) => {
	try{

		//Check if userId is in the body
		if (req.body.userId == null) {
			console.log('Get Info Error: UserID not in request body');
			return res.status(404).json({message: 'UserID not in request body'});
		}

		//find user
		const user = User.findById(req.userId);
		if (!user) {
			return res.status(404).json({message: 'User not in database'});
		}

		user.lastName = req.body.lastName;
		user.firstName = req.body.firstName;
		user.color = req.body.color;

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

	} catch (error) {
		console.log('Update Profile Error: ', error);
		return res.status(500).json({message: 'Internal Server Error'});
	}
})

export default router;