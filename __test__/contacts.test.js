/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * tests the contacts routes
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
 * Contact requests ('/api/contacts'):
 * POST /search - retreives the contacts with information (email, first name, last name) that matches the search term
 * GET /all-contacts - gets an object with a contacts array where each object contains the users full name and UID
 * GET /get-contacts-for-list - gets an object containing a contacts array sorted by time of last message
 * DELETE /delete-dm/:dmId - deleted the indicated DM
 **/


describe('POST /api/contacts/search', () => {
	//connect to virtual database
	//the instance is provided through process.env.MONGO_URL
	beforeAll(async () => {
		await connectDB(process.env.MONGO_URL);
	});

	//disconnect from vitual database after test completion to free resources
	afterAll(async () => {
		await mongoose.disconnect();
	});

	//Before each test, the database is filled
	beforeEach(async () => {
		await User.create({email: 'lisa@gmail.com', password: 'test', firstName: 'Lisa', lastName: 'June'});
		await User.create({email: 'random@gmail.com', password: 'test', firstName: 'random', lastName: 'rand'});
		await User.create({email: 'gregory@gmail.com', password: 'test', firstName: 'Greg', lastName: 'Smith'});
		await User.create({email: 'lisa2@gmail.com', password: 'test', firstName: 'Lisa', lastName: 'March'});
		await User.create({email: '35lisa@gmail.com', password: 'test', firstName: 'NotNamed', lastName: 'Not'});
	})

	//After each test, the database is cleared
	afterEach(async () => {
		await User.deleteMany();
	})

	it('should query the database for lisa and requrn the three valid contacts', async () => {

		//use supertest to POST
		const res = await request(app).post('/api/contacts/search').send({search: 'lisa'});

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