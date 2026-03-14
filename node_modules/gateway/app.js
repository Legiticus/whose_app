/**
 * @file app.js
 * @author Levi Smith
 * 
 * Provides the high level connections and functionality of the backend
 * software
 */

import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

//uses CORS
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend's address
    credentials: true                // Allow cookies/headers
}));

//Logging requests
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//Defining proxy for socket.io
const socketProxy = createProxyMiddleware({
	target: 'http://localhost:4004',
	changeOrigin: true,
	ws: true,
	logLevel: 'debug'
});

app.use('socket.io', socketProxy);

//Route auth requests to authentication service
app.use('/api/auth', createProxyMiddleware({
	target: 'http://localhost:4002/api/auth',
	changeOrigin: true
}));

//Route contact requests to contact service
app.use('/api/contact', createProxyMiddleware({
	target: 'http://localhost:4003',
	changeOrigin: true
}));

//Route message requests to message service
app.use('/api/auth', createProxyMiddleware({
	target: 'http://localhost:4004',
	changeOrigin: true
}));

//Binds the requests body to req.body
app.use(express.json());


export default app;