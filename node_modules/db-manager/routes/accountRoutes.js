import express from "express";

import User from '../models/User.js';

const router = express.Router();

//GET all accounts
router.get('/', (req, res) => {
	res.json({mssg: 'GET all accounts'});
});

//GET single account
router.get('/', (req, res) => {
	res.json({mssg: 'GET single account'})
})

//POST a new account
router.post('/', async (req, res) => {

	try {

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		if (await User.findOne({email})) {
			return res.status(400).json({message: "Email already registered"});
		}

		const user = await User.create({
			email,
			password,
			lastName,
			firstName,
			image,
			profileSetup
		});

		res.status(201).json({message: "User registered successfully", user});

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(400).json({message: 'Internal Server Error'});
	}
})

//DELETE an existing account
router.post('/', (req, res) => {
	res.json({mssg: 'POST a new account'});
})

//PUT an exitsting account
router.put('/', (req, res) => {
	res.json({mssg: 'PUT an existing account'});
})

export default router;