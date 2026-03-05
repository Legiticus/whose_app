import {app, connectDB } from '../app.js';
import User from '../models/User.js';
import request from 'supertest';

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

describe('POST /api/account', () => {
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
		const res = (await request().post('api/accounts')).send({email: 'test@test.com', password: '12345'});

		expect(res.status).toBe(201);
		expect(res.body.message).toBe('User registered successfully');
	});

});