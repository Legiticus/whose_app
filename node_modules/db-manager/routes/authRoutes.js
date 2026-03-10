import express from "express";

import User from '../models/User.js';

const router = express.Router();

//SIGNUP
router.post('/signup', async (req, res) => {

	try {

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		//also checked by authentication service
		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		if (await User.findOne({email})) {
			return res.status(409).json({message: "Email already registered"});
		}

		const user = await User.create({
			email,
			password,
			lastName,
			firstName,
			image,
			profileSetup
		});

		const resBody = {
			message: 'User registered successfully',
			user: {
				id: user._id,
				password: user.password,
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
				profileSetup: user.profileSetup
			}
		}

		res.status(201).json(resBody);
	

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}

});

export default router;