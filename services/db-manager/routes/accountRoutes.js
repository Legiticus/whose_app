const express = require("express");

const router = express.Router();

//GET all accounts
router.get('/', (req, res) => {
	res.json({mssg: 'GET all accounts'});
});

//GET single account
router.get('/:username', (req, res) => {
	res.json({mssg: 'GET single account'})
})

//POST a new account
router.post('/', (req, res) => {
	res.json({mssg: 'POST a new account'});
})

//DELETE an existing account
router.post('/:username', (req, res) => {
	res.json({mssg: 'POST a new account'});
})

//PUT an exitsting account
router.put('/:username', (req, res) => {
	res.json({mssg: 'PUT an existing account'});
})

module.exports = router;