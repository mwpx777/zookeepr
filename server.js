// ctrl + c is stop the server in the terminal
// port is the exact destination on the host

// instantiate the server

const express = require('express');
const PORT = process.env.PORT || 3002;
const app = express();
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const { animals } = require('./data/animals');

// these are MIDDLEWARE FUNCTIONS!

// parse incoming string or array data converts incoming data to key/value pairs that can be accessed in req.body
// extended:true tells server to look deep as possible for sub nested data arrays
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// this will allow server to access and display all files in 'public' folder.  This will allow the files in the folder to become static resources
app.use(express.static('public'));

//  '/' points to the root route of the server 
// this is route used to create a homepage for a server
// this method will respond with HTML page to display in browser
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// listen for requests
// this should always be last on the page
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

