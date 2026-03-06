/**
 * @file app.js
 * @author Levi Smith
 * 
 * Provides the high level connections and functionality of the backend
 * software
 */

import express from 'express';

//Importing routes
import authRoutes from './routes/authRoutes';


const app = express();

//Binds the requests body to req.body
app.use(express.json());

//Middleware
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/auth', authRoutes);

export default app;