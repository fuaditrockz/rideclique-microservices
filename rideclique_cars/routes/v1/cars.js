var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllCars,
  getCarById,
  addNewCar,
  updateCarById,
  deleteCar
} = require('../../dispatchers/Cars')

router.get('/cars', function(req, res, next) {
  Promise.try(() => getAllCars())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_USERS.", err))
});

router.get('/cars/:id', function(req, res) {
  Promise.try(() => getCarById(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to GET_USER_BY_ID: ${req.params.id}`, err))
})

router.post('/add_new_car', function(req, res) {
  Promise.try(() => addNewCar(req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to ADD_NEW_CAR`, err))
})

router.put('/update_car/:id', function(req, res) {
  Promise.try(() => updateCarById(req.params.id, req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to UPDATE_CAR_BY_ID: ${req.params.id}`, err))
})

router.delete('/delete_car/:id', function(req, res) {
  Promise.try(() => deleteCar(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to DELETE_CAR_BY_ID: ${req.params.id}`, err))
})

module.exports = router;
