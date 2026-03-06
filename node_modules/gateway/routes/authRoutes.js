/**
 * @file authRoutes.js
 * @author Levi Smith
 * 
 * Creates and defines the routes for api call regarding the authentication service
 */

import express from 'express';

const router = express.Router();

//--------------------------Signup--------------------------//
router.post('/signup', (req, res) => {
	res.json({message: 'Create User'})
});


//---------------------------Login---------------------------//
//--------------------------Logout--------------------------//
//-----------------------Get User Info-----------------------//


export default router;