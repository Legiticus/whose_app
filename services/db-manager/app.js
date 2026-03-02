

import express from 'express';
import mongoose from 'mongoose';

const app = express();

//-----------------------------------------ROUTING-----------------------------------------//
import accountRoutes from './routes/accountRoutes.js';

//Middleware
app.use(express.json()); //This line binds the requests body to req.body
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/accounts', accountRoutes);

//-----------------------------------------CONNECT TO DATABASE -----------------------------------------//
//-----------------------------------------   BEGIN LISTENER   -----------------------------------------//
//Function for connecting to database
export async function connectDB(uri) {
	const conn = await mongoose.connect(uri);
	console.log(`MongoDB connected: ${conn.connect.host}`);
};

export {app};