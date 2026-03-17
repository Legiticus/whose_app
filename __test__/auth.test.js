/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * tests the authentiction routes
 */

import {app, connectDB } from '../app.js';
import User from '../models/User.js';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * We rely on @shelf/jest-mongodb to supply process.env.MONGO_URL,
 * which points to an in-memory MongoDB instance for testing.
 *
 * jest.config.cjs references @shelf/jest-mongodb as a preset,
 */

/**
 * Account routes ('/api/account'):
 * POST /signup - signs up a new user
 * POST /login - logs a the existing user in
 * POST /logout - logs the user out
 * GET /userinfo - gets the requesting users info
 * POST /update-profile - updates the requesting users profile
 **/


describe('Authentication Routes', () => {
    
    // Connect to the virtual database before tests
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    // Clean up database after each test to ensure isolation
    afterEach(async () => {
        await User.deleteMany({});
    });

    // Close connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    const testUser = {
        email: 'test@example.com',
        password: 'password123'
    };

    describe('POST /signup', () => {
        it('should register a new user and return a 201 status', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(testUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body.user).toHaveProperty('email', testUser.email);
            expect(res.headers['set-cookie']).toBeDefined(); // Check for JWT cookie
        });

        it('should return 400 if email or password missing', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'onlyemail@test.com' });

            expect(res.statusCode).toEqual(400);
        });

        it('should return 409 if user already exists', async () => {
            await User.create({ email: testUser.email, password: 'hashedpassword' });
            const res = await request(app)
                .post('/api/auth/signup')
                .send(testUser);

            expect(res.statusCode).toEqual(409);
        });
    });

    describe('POST /login', () => {
        beforeEach(async () => {
            // Manually register a user for login tests (ensure hashing matches your route logic if necessary)
            // Or just use the signup route to prep
            await request(app).post('/api/auth/signup').send(testUser);
        });

        it('should login existing user and return 200', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(testUser);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('User login successful');
        });

        it('should return 400 for invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: 'wrongpassword' });

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('Authenticated Routes', () => {
        let token;

        beforeEach(async () => {
			const tester = await request(app).post('/api/auth/signup').send(testUser);
			const payload = {userId: tester._id, email: tester.email};
			token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');
        });

        it('POST /update-profile - should update user profile fields', async () => {
            const updateData = {
                firstName: 'FirstNameTest',
                lastName: 'LastNameTest',
                color: 'blue'
            };

            const res = await request(app)
                .post('/api/auth/update-profile')
                .set('Cookie', `jwt=${token}`)
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toBe('FirstNameTest');
            expect(res.body.profileSetup).toBe(true);
        });

        it('GET /userinfo - should return user data when authenticated', async () => {
            const res = await request(app)
                .get('/api/auth/userinfo')
                .set('Cookie', `jwt=${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toBe(testUser.email);
        });

        it('POST /logout - should clear the cookie', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Cookie', `jwt=${token}`);

            expect(res.statusCode).toEqual(200);
            // Check if cookie is cleared (usually by setting it to empty and expiring it)
            expect(res.headers['set-cookie'][0]).toMatch(/jwt=;/);
        });
    });
});