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


//---------TEST SETUP FUNCTIONS-----------//

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
});

//After each test, the database is cleared
afterEach(async () => {
	await User.deleteMany();
});

describe('POST /api/contacts/search', () => {

	it('should query the database for lisa and requrn the three valid contacts', async () => {

		//use supertest to POST
		const res = await request(app).post('/api/contacts/search').send({searchTerm: 'lisa'});

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			contacts: [
				{
					_id: expect.any(String),
					firstName: 'Lisa',
					lastName: 'June',
					email: 'lisa@gmail.com'
				},
				{
					_id: expect.any(String),
					firstName: 'Lisa',
					lastName: 'March',
					email: 'lisa2@gmail.com'
				},
				{
					_id: expect.any(String),
					firstName: 'NotNamed',
					lastName: 'Not',
					email: '35lisa@gmail.com'
				}
			]
		});

	});

	it('should return 400 if insufficient data (search term missing)', async () => {

		//use supertest to POST
		const res = await request(app).post('/api/contacts/search');

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Missing search term');

	});

});


describe('GET /api/contacts/all-contacts', () => {
	it('should return 200 and an object with a contacts array on successful request', async () => {

		const res = await request(app).get('/api/contacts/all-contacts');

		expect(res.status).toBe(200);

		expect(res.body.contacts).toEqual([
			{label: 'Lisa June', value: expect.any(String)},
			{label: 'random rand', value: expect.any(String)},
			{label: 'Greg Smith', value: expect.any(String)},
			{label: 'Lisa March', value: expect.any(String)},
			{label: 'NotNamed Not', value: expect.any(String)}
		]);
	});
});


describe('GET /api/contacts/get-contacts-for-list', () => {

    // Clear and seed with specific timestamps to test sorting
    beforeEach(async () => {
        await User.deleteMany({});
        await User.create([
            { email: 'old@test.com', password: 'pass', firstName: 'Old', lastName: 'Msg', lastMessageTime: new Date('2025-01-01') },
            { email: 'new@test.com', password: 'pass', firstName: 'New', lastName: 'Msg', lastMessageTime: new Date('2025-03-01') },
            { email: 'mid@test.com', password: 'pass', firstName: 'Mid', lastName: 'Msg', lastMessageTime: new Date('2025-02-01') }
        ]);
    });

    it('should return 200 and contacts sorted by lastMessageTime (newest first)', async () => {
        const res = await request(app).get('/api/contacts/get-contacts-for-list');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.contacts)).toBe(true);
        expect(res.body.contacts).toHaveLength(3);

        expect(res.body.contacts[0].email).toBe('new@test.com');
        expect(res.body.contacts[1].email).toBe('mid@test.com');
        expect(res.body.contacts[2].email).toBe('old@test.com');

        expect(res.body.contacts[0]).toEqual({
            _id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            image: expect.any(String),
            color: expect.any(String),
            lastMessageTime: expect.any(String) // JSON dates are strings
        });
    });
});
