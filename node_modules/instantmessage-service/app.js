/**
 * @file app.js
 * @author Levi Smith
 * 
 * This file contains the application functionality of the instant messaging service
 */



import express from 'express';
import cors from 'cors';
import SocketServer from 'socket.io'

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

// Map user => socket.id (e.g., { me: <socketId>, friend: <socketId> })
const userMap = {};

/**
 * 
 */
function chatHandler(req, res) {
	const {sender, text} = req.body;
}