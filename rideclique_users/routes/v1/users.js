var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllUsers,
  getUserById,
  updateUserById,
  registerNewUser,
  updateVerification,
  blockUser
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
  Promise.try(() => registerNewUser(req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => res.status(err.status).json(err))
})

router.put('/verification/:id', function(req, res) {
  Promise.try(() => updateVerification(req.params.id, req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => res.status(err.status).json(err))
})

router.put('/block_user/:id', function(req, res) {
  Promise.try(() => blockUser(req.params.id, req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => res.status(err.status).json(err))
})

module.exports = router;