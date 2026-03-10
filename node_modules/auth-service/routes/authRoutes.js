import express from "express";
import User from '../models/User.js';
import axios from 'axios';
import bcrypt from "bcrypt"; // Library for securely hashing passwords

const router = express.Router();

//SIGNUP
router.post('/signup', async (req, res) => {

	try {

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		//Hash password before sending to database manager
		const hashedPass = await bcrypt.hash(password, process.env.SALT_ROUNDS);

		const postBody = {
			email,
			password: hashedPass,
			lastName,
			firstName,
			image,
			profileSetup
		}

		const dbURL = 'localhost:4001';

		const response = await axios.post('http://service-b:3000/data', { key: 'value' });

		if (res.status == 201) {
			const token = jwt.sign({email, id: response.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
		}

		res.cookie("jwt", token, {
			secure: true, // Ensures the cookie is only sent over HTTPS (important in production)
			sameSite: "None", // Allows cross-origin cookies when using credentials
			maxAge: 60 * 60 * 1000, // 1 hour expiration
		})

		res.status(responce.status).json(responce.json);

		if (await User.findOne({email})) {
			return res.status(409).json({message: "Email already registered"});
		}

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

//LOGIN
router.post('/login', async () => {
	try {

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		//Hash password before sending to database manager
		const hashedPass = await bcrypt.hash(password, process.env.SALT_ROUNDS);

		const postBody = {
			email,
			password: hashedPass,
			lastName,
			firstName,
			image,
			profileSetup
		}

		const dbURL = 'localhost:4001';

		const response = await axios.post('http://service-b:3000/data', { key: 'value' });

		if (res.status == 201) {
			const token = jwt.sign({email, id: response.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
		}

		res.cookie("jwt", token, {
			secure: true, // Ensures the cookie is only sent over HTTPS (important in production)
			sameSite: "None", // Allows cross-origin cookies when using credentials
			maxAge: 60 * 60 * 1000, // 1 hour expiration
		})

		res.status(responce.status).json(responce.json);

		if (await User.findOne({email})) {
			return res.status(409).json({message: "Email already registered"});
		}

	}catch (error) {
		console.error('Login Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

export default router;