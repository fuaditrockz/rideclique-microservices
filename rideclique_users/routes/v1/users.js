var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllUsers,
  getUserById
} = require('../../dispatchers/Users')

router.get('/', function(req, res) {
  Promise.try(() => getAllUsers())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_USERS", err))
});

router.get('/:id', function(req, res, next) {
  Promise.try(() => getUserById(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to GET_USER_BY_ID: ${req.params.id}`, err))
})

module.exports = router;