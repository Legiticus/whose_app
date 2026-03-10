import express from "express";
import axios from 'axios';
import bcrypt from "bcrypt"; // Library for securely hashing passwords
import jwt from 'jsonwebtoken';

const router = express.Router();



/**
 * Middleware: verify token
 * Extracts the jwt from the jwt cookie and
 * attaches it to the request.
 * - If missing, returns 401 (Unauthorized).
 * - If invalid or expired, returns 403 (Forbidden).
 * - If unknown error occurs, returns 500 (Internal Server Error)
 * - If valid, extracts `userId` from the payload and attaches it to `req.userId`.
 */
function verifyToken(req, res, next) {
	try {

		const token = req.cookies.jwt;
  		if (!token) return res.status(401).json({ message: "Not authenticated" });

		jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
			if (err) {
				console.log("Token Error: invalid or expired token");
				return res.status(403).json({ message: "Invalid or expired token" });
			}
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

		const {email, password, lastName, firstName, image, profileSetup} = req.body;

		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		//Hash password before sending to database manager
		const hashedPass = await bcrypt.hash(password, process.env.SALT_ROUNDS);

		//Package and send login request to database service for checking
		const postBody = {
			email,
			password: hashedPass,
			lastName,
			firstName,
			image,
			profileSetup
		};
		const dbURL = 'localhost:4001';
		const response = await axios.post(dbURL, postBody);

		if (res.status == 201) {
			const token = jwt.sign({email, userId: response.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
		}

		res.cookie("jwt", token, {
			secure: true, // Ensures the cookie is only sent over HTTPS (important in production)
			sameSite: "None", // Allows cross-origin cookies when using credentials
			maxAge: 60 * 60 * 1000, // 1 hour expiration
		})

		res.status(responce.status).json(responce.json);

	}catch (error) {
		console.error('Signup Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

//LOGIN
router.post('/login', async (req, res) => {
	try {

		const {email, password} = req.body;

		if (!email || !password ) {
			return res.status(400).json({message: "Email and password required"});
		}

		//Hash password before sending to database manager
		const hashedPass = await bcrypt.hash(password, process.env.SALT_ROUNDS);

		//Package and send login request to database service for checking
		const postBody = {
			email,
			password: hashedPass
		};
		const dbURL = 'localhost:4001';
		const response = await axios.post(dbURL, postBody);

		if (res.status == 201) {
			const token = jwt.sign({email, userId: response.id}, process.env.SECRET_KEY, {expiresIn: "1h"});
		}

		res.cookie("jwt", token, {
			secure: true, // Ensures the cookie is only sent over HTTPS (important in production)
			sameSite: "None", // Allows cross-origin cookies when using credentials
			maxAge: 60 * 60 * 1000, // 1 hour expiration
		})

		res.status(response.status).json(response.json);

	}catch (error) {
		console.error('Login Error:', error);
		res.status(500).json({message: 'Internal Server Error'});
	}
});

router.post('/logout', verifyToken, async (req, res) => {
	try {
		res.clearCookie('jwt', {
			secure: true,
			sameSite: "None"
		});
		return res.status(200).json('Logout successful');
	} catch (error) {
		console.log('Logout Error: ', error);
		return res.status(500).json({message: 'Internal Server Error'});
	}
});


router.get('/userinfo', verifyToken, async (req, res) => {
	try {

		if (req.userId == null) {
			console.log('Get Info Error: UserID not in token');
			return res.status(404).json({message: 'UserID not in token'});
		}
	} catch (error) {
		console.log('Get Info Error: ', error);
		return res.status(500).json({message: 'Internal Server Error'});
	}
	
});

export default router;