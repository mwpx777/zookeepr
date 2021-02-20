// ctrl + c is stop the server in the terminal
// port is the exact destination on the host

// instantiate the server

const express = require('express');
const app = express();

const { animals } = require('./data/animals');

// get is a method that requires 2 arguments
// first is string that describes the route the client will have to fetch from
// second is callback function that will execute every time route is accessed with GET request
// req = request
// res = response
// this will take in req.query and animalArray and return new array with the results
// this is a method!
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits]
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
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
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// listen for requests
app.listen(3001, () => {
    console.log('API server now on port 3001');
});