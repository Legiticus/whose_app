/**
 * @file index.js
 * @author Levi Smith
 * 
 * Serves as the basic entry point for the backend software
 */

import dotenv from 'dotenv';
import app, {socketProxy} from './app.js';

dotenv.config();

const PORT = process.env.PORT || 8747;

const server = app.listen(PORT, () => {
	console.log(`API Gateway running on port ${PORT}`);
});

//Handle the WebSocket upgrade
server.on('upgrade', (req, socket, head) => {
    socketProxy.upgrade(req, socket, head);
});