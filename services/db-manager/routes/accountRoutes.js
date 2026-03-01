import express from "express";

import User from '../models/User';

const router = express.Router();

//GET all accounts
router.get('/', (req, res) => {
	res.json({mssg: 'GET all accounts'});
});

//GET single account
router.get('/:username', (req, res) => {
	res.json({mssg: 'GET single account'})
})

//POST a new account
router.post('/', async (req, res) => {
	const {username, password, lastName, firstName, image, profileSetup} = req.body;

	try {
		const user = await User.create({
			username,
			password,
			lastName,
			firstName,
			image,
			profileSetup
		});
		res.status(200).json(user);
	}catch (error) {
		res.status(400).json({error: error.message});
	}
})

//DELETE an existing account
router.post('/:username', (req, res) => {
	res.json({mssg: 'POST a new account'});
})

//PUT an exitsting account
router.put('/:username', (req, res) => {
	res.json({mssg: 'PUT an existing account'});
})

module.exports = router;