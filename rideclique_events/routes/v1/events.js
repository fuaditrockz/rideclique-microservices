var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllEvents,
  getEventById,
  addNewEvent,
  findCity
} = require('../../dispatchers/Events')

router.get('/events', function(req, res, next) {
  Promise.try(() => getAllEvents())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_EVENTS.", err))
});

router.get('/events/:id', function(req, res) {
  Promise.try(() => getEventById(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to GET_EVENT_BY_ID: ${req.params.id}`, err))
})

router.post('/add_new_event', function(req, res) {
  Promise.try(() => addNewEvent(req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to ADD_NEW_EVENT`, err))
})

module.exports = router;
