/**
 * @file app.js
 * @author Levi Smith
 * 
 * This file contains the application functionality of the instant messaging service
 */



import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';

const PORT = process.env.PORT || 4004;

const app = express();
const httpServer =  createServer(app);

//Middleware for logging requests
app.use((req, res, next) => {
	console.log(`[IM Service]: ${req.method} ${req.path}`);
	next();
});

//Starting server on given port
const io = new Server(httpServer, {
	cors: { origin: '*' } //Allows for connections from anywhere
});

httpServer.listen(PORT, () => {

	console.log(`Socket.IO server is running on port ${PORT}`);

});

// Map user => socket.id (e.g., { me: <socketId>, friend: <socketId> })
const socketMap = new Map();

io.use((socket, next) => {
    // This runs once per connection attempt
    console.log(`Handshake request from: ${socket.handshake.address}`);
    next();
});

// Handle socket connections
io.on("connection", (socket) => {

	//client connects with id as query param
	const userId = socket.handshake.query.userId;
	console.log(`Client connected: socketId=${socket.id}, user="${userId}"`);

	//Store the user socket pair in the socketMap map
	socketMap.set(userId, socket);

	if (userId) {
		// Store the mapping (e.g., socketMap["me"] = <socketId>)
		socketMap.set(user, socket.id);
		console.log(`Client connected: socketId=${socket.id}, user="${user}"`);
		socket.disconnect();
	}else {
		console.log('Failed Connection');
	}

	//handle 'sendMessage' events
	socket.on('sendMessage', async (payload) => {

		const {sender, recipient, content, messageType = 'text'} = payload;
		console.log(`"sendMessage event triggered: sender="${sender}", recipitant="${recipient}"`)

		const messageObject = {
			id: 123,
			sender: {id: sender},
			recipient: {id: recipient},
			content: content,
			messageType: messageType,
			timestamp: new Date().toISOString()
		}

		const recipientSocket = socketMap.get(recipient);
		const senderSocket = socketMap.get(sender);

		if (recipientSocket) {
			console.log('Sending Message to Recipient');
			io.to(recipientSocket).emit('receiveMessage', messageObject);
		}

		if (senderSocket) {
			console.log('Sending Message to Sender');
			io.to(senderSocket).emit('receiveMessage', messageObject);
		}
		//send request to database to store chat message
		console.log('Sending message to database');


	});

	socket.on("disconnect", () => {
		console.log(`Client disconnected: socketId=${socket.id}, user="${userId}"`);
		// Remove user from the map
		delete socketMap[user];
	});
});
