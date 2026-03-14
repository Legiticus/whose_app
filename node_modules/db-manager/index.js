/**
 * @file index.js
 * @author Levi Smith
 * 
 * The main entry file for the database manager service
 */


import dotenv from 'dotenv'
import {app, connectDB} from './app.js';

dotenv.config();

const PORT = process.env.PORT;

//Connect to database
async function startServer() {
	try {
		await connectDB(process.env.DB_URI);
		console.log('Connected to database')
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});	
	}catch (error) {
		console.error('Failed to connect to MongoDB: ', error.message);
		process.exit(1); //Exits the process with failure
	}

}

startServer();