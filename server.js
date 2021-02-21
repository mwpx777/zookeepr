// ctrl + c is stop the server in the terminal
// port is the exact destination on the host

// instantiate the server

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

const { animals } = require('./data/animals');

// these are MIDDLEWARE FUNCTIONS!

// parse incoming string or array data converts incoming data to key/value pairs that can be accessed in req.body
// extended:true tells server to look deep as possible for sub nested data arrays
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

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
};

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}
// this request will take search for multiple items
app.get('/api/animals', (req, res) => {
    let results = animals;
    // this will call filterByQuery function and pass in req.query and results
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

function createNewAnimal(body, animalsArray) {
    const animal = body;
    // this will push new animal created to animalsArray
    animalsArray.push(animal);
    // this is a method!
    // this will write animals.json file in the data subdirectory 
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // null means dont edit any info in the array, 2 just adds whitespace to the array to read easier
        JSON.stringify({animals: animalsArray} , null, 2)
    );
   
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !=='string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if(!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
        return false;
    }
    return true;
}

// this request will only take in a single parameter 'id'
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any of the data in req.body id incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }else{
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

    // add animal to json file and animalsArray in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
});

// listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

