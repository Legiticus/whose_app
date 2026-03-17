/**
 * @file index.js
 * @author Levi Smith
 * 
 * This file contains the main program entry point of the application
 */

import dotenv from 'dotenv';
import {app, connectDB} from './app.js'
import { Server } from 'socket.io';

//Socket Imports
import socketConnectionHandler from './sockets/socketConnectionHandler.js';

dotenv.config();

const PORT = process.env.PORT || 8747;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
	console.log('//------------------------------ERROR------------------------------//');
	console.log('Missing \"MONGO_URL\" in \".env\" file.\n');
	return -1;
}

async function startServer() {
	try {
		await connectDB(MONGO_URL);
		console.log('Connected to database')
		const server = app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

		// Attach Socket.io to the server
		const io = new Server(server, {
			cors: {
				origin: "http://localhost:3000",
				credentials: true,
			},
		});

		io.on('connect', (socket) => socketConnectionHandler(io, socket));

	} catch (error) {
		console.error('Failed to connect to MongoDB: ', error.message);
		process.exit(1); //Exits the process with failure
	}
}

startServer();
