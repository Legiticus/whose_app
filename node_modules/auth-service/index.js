/**
 * @file index.js
 * @author Levi Smith
 * 
 * The entry file for the authentication service
 */

import dotenv from 'dotenv'
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT;


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
