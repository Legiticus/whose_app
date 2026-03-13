/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * Tests the authentication functionality of the gateway
 */

import app from '../app.js';
import request from 'supertest';
import jwt from 'jsonwebtoken';

/**
 * Authentication requests ('/api/auth') to test include the following
 * POST	('/signup')			- Creates a new user
 * POST ('/login')			- Logs a user in and creates a user object
 * POST ('/logout')			- Logs the user out
 * GET  ('/userinfo')		- Gets the user info
 * POST ('/update-profile')	- Updates the user profile
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
		expect(res.body.user).toEqual({
			'id': expect.any(String),
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


describe('POST /api/auth/login', () => {

	it('should return 200 and user object for successful login', async () => {

		//stage user in database
		const stageRes = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'testpass'});
		expect(stageRes.status).toBe(201);

		const res = await request(app).post('/api/auth/login').send({email: 'test@test.com', password: 'testpass'});

		expect(res.status).toBe(200);
		expect(res.body.user).toEqual({
			'id': expect.any(String),
			'email': 'test@test.com',
			"firstName": "",
			"lastName": "",
			"image": "",
			"profileSetup": false
		});
	
	});

	it('should return 400 if email or password are missing', async () => {

		//stage user in database
		const stageRes = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'testpass'});
		expect(stageRes.status).toBe(201);

		//missing password
		let res = await request(app).post('/api/auth/login').send({email: 'test@test.com'});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Missing password or email or invalid password');

		//missing password
		res = await request(app).post('/api/auth/login').send({password: 'testpass'});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Missing password or email or invalid password');

		//invalid password
		res = await request(app).post('/api/auth/login').send({email: 'test@test.com', password: 'badpass'});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Missing password or email or invalid password');

	});

	it('should return 404 if no user found with given email', async () => {

		//request for non=existing user
		const res = await request(app).post('/api/auth/login').send({email: 'test@test.com', password: 'testpass'});

		expect(res.status).toBe(404);
		expect(res.body.message).toBe('No user found with given email');

	});

	/*
	it('should return 500 for internal server error', async () => {

	});
	*/

});

describe('POST /api/auth/logout', () => {

	it('should return 200 for successful logout', async () => {

		//UID sent via JWT token
		const res = await request(app).post('/api/auth/logout');

		expect(res.status).toBe(200);
		expect(res.body.message).toBe('Logout successful');

	});

	/*
	it('should return 500 for internal server error', async () => {

	});
	*/

});

describe('GET /api/auth/userinfo', () => {

	it('should return 200 with data for data found and retrieved', async () => {

		//stage user in database
		const stageRes = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'testpass'});
		expect(stageRes.status).toBe(201);

		//create and attach token
		const payload = {userId: stageRes.body.user.id};
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		const res = (await request(app).get('/api/auth/userinfo')).setEncoding('Authorization', `Bearer: ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			'id': expect.any(String),
			'email': 'test@test.com',
			"firstName": "",
			"lastName": "",
			"image": "",
			"profileSetup": false
		});

	});

	it('should return 404 if user id not in token or user does not exist in database', async () => {

		let res = await request(app).get('/api/auth/userinfo');
		expect(res.status).toBe(404);
		expect(res.body).toBe('UserID not in token');



		//create and attach token
		const payload = {userId: '1234'}; // bad user id
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		res = (await request(app).get('/api/auth/userinfo')).setEncoding('Authorization', `Bearer: ${token}`);

		expect(res.status).toBe(404);
		expect(res.body).toBe('User not in database');

	});

	/*
	it('should return 500 for internal server error', async () => {

	});
	*/

});

describe('POST /api/auth/update-profile', () => {

	let authCookie;

	beforeEach(async () => {

		//stage user in database
		const stageRes = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'testpass'});

		authCookie = res.headers['set-cookie'];

		//TESTING DESIGN PAUSED HERE UNITL LATER DATE DUE TO DATABASE INTERACTION COMPLEXITIES

	});

	afterEach(async () => {

	});

	it('should return 200 for successful profile update', async () => {
		

	});

	it('should return 400 if missing userId in token or required fields', async () => {

	});

	/*
	it('should return 500 for internal server error', async () => {

	});
	*/

});
