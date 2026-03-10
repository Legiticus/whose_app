/**
 * @file index.js
 * @author Levi Smith
 * 
 * Entry point for authentication service
 */

import express from 'express';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authRoutes from './routes/authRoutes.js';


//Importing routes


const app = express();

//Binds the requests body to req.body
app.use(express.json());

app.use(cookieParser());

//Middleware
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/auth', authRoutes);

export default app;