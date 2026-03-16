/**
 * @file app.js
 * @author Levi Smith
 * 
 * This file contains the application routing code
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//Route Imports
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

//-----------------------------------------MIDDLEWARE-----------------------------------------//

//uses CORS
app.use(cors({
	origin: 'http://localhost:3000', // Your frontend's address
	credentials: true                // Allow cookies/headers
}));

//Bind the request body to req.body
app.use(express.json());

//Populates the cookies in req.cookies
app.use(cookieParser())

//print methods and route calls for debugging purposes
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});


//-----------------------------------------ROUTING-----------------------------------------//
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messageRoutes);

//-----------------------------------------CONNECT TO DATABASE -----------------------------------------//
//Function for connecting to database
export async function connectDB(uri) {
	const conn = await mongoose.connect(uri);
	console.log(`MongoDB connected: ${conn.connect.host}`);
};

export { app };