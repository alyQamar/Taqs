// Define the port and host for the server
const port = process.env.PORT || 5000;
const host = 'localhost';

// Create the base URL for the server
const serverUrl = `http://${host}:${port}/`;

// Initialize an object to store data
let data = {};

// Import the required packages
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Use the middleware for CORS and body parsing
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "view" directory
app.use(express.static('view'));

// Define a function to handle posting data
const posting = (req, res) => {
  // Update the data object with the request body
  data = req.body;

  // Send a success response with the data
  res.status(200).send(data);
};

// Define a GET route to retrieve all data
app.get('/all', (req, res) => res.status(200).send(data));

// Define a POST route to add new data
app.post('/add', posting);

// Start the server
app.listen(port, () => console.log(`Server is running on ${serverUrl}`));
