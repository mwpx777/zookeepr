// ctrl + c is stop the server in the terminal
// port is the exact destination on the host

// instantiate the server

const express = require('express');
const app = express();

const {animals} = require('./data/animals');

// get is a method that requires 2 arguments
// first is string that describes the route the client will have to fetch from
// second is callback function that will execute every time route is accessed with GET request
// req = request
// res = response
// this will take in req.query and animalArray and return new array with the results
function filterByQuery(query, animalsArray){
    let filteredResults = animalsArray;
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    // this will call filterByQuery function and pass in req.query and results
    if (req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

// listen for requests
app.listen(3001, () => {
    console.log('API server now on port 3001');
});