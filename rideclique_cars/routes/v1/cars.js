var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllCars
} = require('../../dispatchers/Cars')

router.get('/', function(req, res, next) {
  Promise.try(() => getAllCars())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_USERS.", err))
});

module.exports = router;
