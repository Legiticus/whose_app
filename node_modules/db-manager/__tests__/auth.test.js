/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * tests the authentiction routes for the database manager
 */

import {app, connectDB } from '../app.js';
import User from '../models/User.js';
import request from 'supertest';
import mongoose from 'mongoose';

/**
 * We rely on @shelf/jest-mongodb to supply process.env.MONGO_URL,
 * which points to an in-memory MongoDB instance for testing.
 *
 * jest.config.cjs references @shelf/jest-mongodb as a preset,
 */

/**
 * Account requests ('/api/account') to test include the following
 * GET - gets user profile data
 * POST - creates a new user profile
 * PUT - updates the entire user profile
 * DELETE - deletes the user profile
 **/


describe('POST /api/auth/signup', () => {
	//connect to virtual database
	//the instance is provided through process.env.MONGO_URL
	beforeAll(async () => {
		await connectDB(process.env.MONGO_URL);
	});

	//disconnect from vitual database after test completion to free resources
	afterAll(async () => {
		await mongoose.disconnect();
	});

	//After each test, the database is cleared
	afterEach(async () => {
		await User.deleteMany();
	})

	/**
	 * Test 1:
	 * Requests with valid input and unique email result in the
	 * successful creation of a user account with a return status 
	 * of 201 with a success message.
	 */
	it('should create a valid user entry in the database and return 201', async () => {

		//use supertest to POST
		const res = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: '12345'});

		expect(res.status).toBe(201);
		expect(res.body).toEqual({
			message: 'User registered successfully',
			user: {
				id: expect.any(String),
				email: 'test@test.com',
				profileSetup: false
			}
		});

		//Check that the user has been successfully stored in the database
		const userInDb = await User.findOne({email: "test@test.com"});
		expect(userInDb).not.toBeNull();
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
	it('should return 400 if email already registed in system', async () => {

		//manually create account
		await User.create({email: 'test@test.com', password: 'password'});

		//Attempt to sign up with the same email
		const res = await request(app).post('/api/auth/signup').send({email: 'test@test.com', password: 'betterPassword'});

		//check values
		expect(res.status).toBe(409);
		expect(res.body.message).toBe('Email already registered');

	});

});