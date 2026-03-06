/**
 * @file index.js
 * @author Levi Smith
 * 
 * Serves as the basic entry point for the backend software
 */

import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`API Gateway running on port ${PORT}`);
});