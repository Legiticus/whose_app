import express from "express";

import User from '../models/User.js';

const router = express.Router();

//SIGNUP
router.post('/signup', async (req, res) => {

	try {

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

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
			id: user._id,
			password: user.password,
			lastName: user.lastName,
			firstName: user.firstName,
			image: user.image,
			profileSetup: user.profileSetup
		}

		res.status(201).json({user: {resBody}});

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
})

//LOGIN
router.post('/login', async () => {

});

export default router;