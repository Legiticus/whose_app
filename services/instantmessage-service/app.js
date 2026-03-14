/**
 * @file app.js
 * @author Levi Smith
 * 
 * This file contains the application functionality of the instant messaging service
 */



import express from 'express';
import SocketServer from 'socket.io'

const app = express();
app.use(express.json());

// Map user => socket.id (e.g., { me: <socketId>, friend: <socketId> })
const userMap = {};

/**
 * 
 */
function chatHandler(req, res) {
	const {sender, text} = req.body;
}

//Starting server on given port
const io = new Server(process.env.PORT || 4004, {
	cors: {origin: '*' } //Allows for connections from anywhere
});

io.on


// Handle socket connections
io.on("connection", (socket) => {
  // The client sends a query param like: /socket.io/?user=me
  const user = socket.handshake.query.user;
  console.log(`Client connected: socketId=${socket.id}, user="${user}"`);

  // Store the mapping (e.g., userMap["me"] = <socketId>)
  userMap[user] = socket.id;

  socket.on("disconnect", () => {
    console.log(`Client disconnected: socketId=${socket.id}, user="${user}"`);
    // Remove user from the map
    delete userMap[user];
  });
});
