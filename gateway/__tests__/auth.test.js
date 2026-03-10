/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * Tests the authentication functionality of the gateway
 */

import app from '../app.js';
import request from 'supertest';

/**
 * Authentication requests ('/api/auth') to test include the following
 * POST	('/signup')			- Creates a new user
 * POST ('/login')			- Logs a user in and creates a user object
 * POST ('logout')			- Logs the user out
 * GET  ('userinfo')		- Gets the user info
 * POST ('update-profile')	- Updates the user profile
 */

describe('POST /api/auth/signup', () => {
	
	/**
	 * Test 1:
	 * Requests with valid input and unique email result in the
	 * successful creation of a user account with a return status 
	 * of 201 with a success message.
	 */
	it('should create a new user in the system and return 201', async () => {

		const res = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'testpass'});

		expect(res.status).toBe(201);
		expect(res.body.message).toBe({
			'id': '1',
			'email': 'test@test.com',
			"firstName": "",
			"lastName": "",
			"image": "",
			"profileSetup": false
		});

	});

	/**
	 * Test 2:
	 * Request with insufficient input (email or password missing)
	 * results in return code of 400
	 */
	it('should return 400 if insufficient data (email or password missing)', async () => {
	
			//MISSING EMAIL
			//use supertest to POST
			let res = await request(app).post('/api/auth/signup').send({email: 'test@test.com'});
	
			//Checking for expected values
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Email and password required');
	
			//MISSING PASSWORD
			//use supertest to POST
			res = await request(app).post('/api/auth/signup').send({password: 'samplepass'});
	
			//Checking for expected values
			expect(res.status).toBe(400);
			expect(res.body.message).toBe('Email and password required');
	});

	/**
	 * Test 3:
	 * Request that attempt to register a new account with an email already
	 * registered in the system return 400
	 */
	it('should return 409 if email already registed in system', async () => {

		//create account
		await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'password'});

		//Attempt to sign up with the same email
		const res = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'betterPassword'});

		//check values
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Email already registered');

	});
			
});