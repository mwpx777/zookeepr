// lib.animals and data.animals are 2 levels above, so need extra ../
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const {animals} = require('../../data/animals');
const router = require('express').Router();

// get is a method that requires 2 arguments
// first is string that describes the route the client will have to fetch from
// second is callback function that will execute every time route is accessed with GET request
// req = request
// res = response
// this will take in req.query and animalArray and return new array with the results
// this is a method!

// this request will take search for multiple items
router.get('/animals', (req, res) => {
    let results = animals;
    // this will call filterByQuery function and pass in req.query and results
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});



// this request will only take in a single parameter 'id'
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/animals', (req, res) => {
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


module.exports = router;