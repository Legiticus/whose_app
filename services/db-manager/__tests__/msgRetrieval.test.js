/**
 * @file auth.test.js
 * @author Levi Smith
 * 
 * Unit test for the functionality of message retrieval
 */

import {app, connectDB} from '../app.js';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * We rely on @shelf/jest-mongodb to supply process.env.MONGO_URL,
 * which points to an in-memory MongoDB instance for testing.
 *
 * jest.config.cjs references @shelf/jest-mongodb as a preset,
 */

/**
 * See test plan for further specification
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

		const chat1 = await Chat.create({participants: [user1, user2]});
		const chat2 = await Chat.create({participants: [user1, user3]});
		const chat3 = await Chat.create({participants: [user2, user3]});

		const msg11 = await Message.create({chatId: chat1, senderId: user1, recipients: user2, content: 'user 1'});
		const msg12 = await Message.create({chatId: chat1, senderId: user2, recipients: user1, content: 'user 2'});

		const msg21 = await Message.create({chatId: chat2, senderId: user1, recipients: user3, content: 'user 1'});
		const msg22 = await Message.create({chatId: chat2, senderId: user3, recipients: user1, content: 'user 3'});

		const msg31 = await Message.create({chatId: chat3, senderId: user2, recipients: user3, content: 'user 2'});
		const msg32 = await Message.create({chatId: chat3, senderId: user3, recipients: user2, content: 'user 3'});

	});

	afterEach(async () => {
		await User.deleteMany();
		await Chat.deleteMany();
		await Message.deleteMany();
	});

	it('should gather all messages between a user and the given contact', async () => {

		const requestingUser = await User.findOne({email: 'User1@test.com'});
		const contact = await User.findOne({email: 'User2@test.com'});
		const chat = await Chat.findOne({participants: [requestingUser, contact]});

		const res = await request(app).post('/api/accounts/')

	});
});