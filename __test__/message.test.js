/**
 * @file message.test.js
 * @author Levi Smith
 * 
 * Unit test for the functionality of message retrieval
 */

import {app, connectDB} from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//Import relavent models
import User from '../models/User.js';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';


/**
 * POST /get-messages - gets all messages between requestor and requested id
 */

describe('POST /api/messages/get-messages', () => {
	beforeAll(async () => {
		await connectDB(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {

		//proc database with users, chats and messages
		const user1 = await User.create({email: 'User1@test.com', password: 'pass'});
		const user2 = await User.create({email: 'User2@test.com', password: 'pass'});
		const user3 = await User.create({email: 'User3@test.com', password: 'pass'});
		const user4 = await User.create({email: 'User4@test.com', password: 'pass'}); //For user with no msgs to it

		const chat1 = await Chat.create({participants: [user1, user2]});
		const chat2 = await Chat.create({participants: [user1, user3]});
		const chat3 = await Chat.create({participants: [user2, user3]});

		const msg11 = await Message.create({chatId: chat1, sender: user1, recipient: user2, content: 'user 1'});
		const msg12 = await Message.create({chatId: chat1, sender: user2, recipient: user1, content: 'user 2'});

		const msg21 = await Message.create({chatId: chat2, sender: user1, recipient: user3, content: 'user 1'});
		const msg22 = await Message.create({chatId: chat2, sender: user3, recipient: user1, content: 'user 3'});

		const msg31 = await Message.create({chatId: chat3, sender: user2, recipient: user3, content: 'user 2'});
		const msg32 = await Message.create({chatId: chat3, sender: user3, recipient: user2, content: 'user 3'});

	});

	afterEach(async () => {
		await User.deleteMany();
		await Chat.deleteMany();
		await Message.deleteMany();
	});

	it('should return 200 gather all messages between a user and the given contact', async () => {
		
		//Create valid token to attach to request
		const requestor = await User.findOne({email: 'User1@test.com'});
		const payload = {userId: requestor._id, email: requestor.email};
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		const requestingUser = await User.findOne({email: 'User1@test.com'});
		const contact = await User.findOne({email: 'User2@test.com'});
		const chat = await Chat.findOne({participants: [requestingUser, contact]});

		const res = await request(app)
		.post('/api/messages/get-messages')
		.send({id: contact._id})
		.set('Cookie', `jwt=${token}`);

		expect(res.status).toBe(200);
		expect(res.body.messages).toHaveLength(2);
		expect(res.body.messages[0]).toMatchObject({
			sender: requestor._id.toString(),
			content: 'user 1'
		});
		expect(res.body.messages[1]).toMatchObject({
			sender: contact._id.toString(),
			content: 'user 2'
		});
	});

	it('should return 400 Bad Request if the contact id is missing', async () => {

		// Create valid token to satisfy verifyToken middleware
		const requestor = await User.findOne({email: 'User1@test.com'});
		const payload = {userId: requestor._id, email: requestor.email};
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		//Send request with an empty body (missing 'id')
		const res = await request(app)
			.post('/api/messages/get-messages')
			.set('Cookie', `jwt=${token}`)
			.send({}); // Missing the "id" field

		//Assert
		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			message: 'Missing one or both IDs'
		});
	});

	it('should return 403 Forbidden if the user attempts to query messages with themselves', async () => {
		// Create valid token for User1
		const requestor = await User.findOne({email: 'User1@test.com'});
		const payload = {userId: requestor._id, email: requestor.email};
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		//Send request where 'id' in body matches the 'userId' in the token
		const res = await request(app)
			.post('/api/messages/get-messages')
			.set('Cookie', `jwt=${token}`)
			.send({id: requestor._id.toString()});

		//Assert: Match the specific 403 and string response from your handler
		expect(res.status).toBe(403);
		expect(res.body).toBe('Forbidden: User attempted to query messages with themselves');
	});

	it('should return 200 and an empty messages array if no chat exists between users', async () => {
		// Arrange: Use User1 and User4 (no chat between them)
		const requestor = await User.findOne({email: 'User1@test.com'});
		const contact = await User.findOne({email: 'User4@test.com'});
		
		const payload = {userId: requestor._id, email: requestor.email};
		const token = jwt.sign(payload, process.env.SECRET_KEY || 'Testkey');

		// Act: Request messages with a user who has no history with the requestor
		const res = await request(app)
			.post('/api/messages/get-messages')
			.set('Cookie', `jwt=${token}`)
			.send({id: contact._id.toString()});

		// Assert: Verify the "No chat exists yet" logic path
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			messages: []
		});
		expect(res.body.messages).toHaveLength(0);
	});
});