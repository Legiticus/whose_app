require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT;

//-----------------------------------------SCHEMAS-----------------------------------------//






//-----------------------------------------ROUTING-----------------------------------------//
const accountRoutes = require('./routes/accountRoutes');

//Middleware
app.use(express.json()); //This line binds the requests body to req.body
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/accounts', accountRoutes);




app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//-----------------------------------------CONNECT TO DATABASE -----------------------------------------//
//-----------------------------------------   BEGIN LISTENER   -----------------------------------------//
//Function for connecting to database
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URI);
		console.log(`MongoDB connected: ${conn.connect.host}`);
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	}catch (error) {
		console.error('Failed to connect to MongoDB: ', error.message);
		process.exit(1); //Exits the process with failure
	}
};

//Connect to database
connectDB();
