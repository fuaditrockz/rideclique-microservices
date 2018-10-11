var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllUsers,
  getUserById,
  updateUserById,
  registerNewUser
} = require('../../dispatchers/Users')

router.get('/', function(req, res) {
  Promise.try(() => getAllUsers())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_USERS.", err))
});

router.get('/:id', function(req, res) {
  Promise.try(() => getUserById(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to GET_USER_BY_ID: ${req.params.id}`, err))
})

router.put('/:id', function(req, res) {
  Promise.try(() => updateUserById(req.params.id, req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to UPDATE_USER_BY_ID: ${req.params.id}`, err))
})

router.post('/register', function(req, res) {
  Promise.try(() => registerNewUser())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to REGISTER_NEW_USER.`, err))
})

module.exports = router;