var express = require('express');
var router = express.Router();

const Promise = require('bluebird')

const {
  getAllBrands,
  getBrandById,
  addNewBrand,
  updateBrandById,
  deleteBrand
} = require('../../dispatchers/Brands')

router.get('/brands', function(req, res, next) {
  Promise.try(() => getAllBrands())
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log("Failed to GET_ALL_USERS.", err))
});

router.get('/brands/:id', function(req, res) {
  Promise.try(() => getBrandById(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to GET_USER_BY_ID: ${req.params.id}`, err))
})

router.post('/add_new_brand', function(req, res) {
  Promise.try(() => addNewBrand(req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to ADD_NEW_BRAND`, err))
})

router.put('/update_brand/:id', function(req, res) {
  Promise.try(() => updateBrandById(req.params.id, req.body))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to UPDATE_BRAND_BY_ID: ${req.params.id}`, err))
})

router.delete('/delete_brand/:id', function(req, res) {
  Promise.try(() => deleteBrand(req.params.id))
    .then(response => res.status(response.status).json(response))
    .catch(err => console.log(`Failed to DELETE_BRAND_BY_ID: ${req.params.id}`, err))
})

module.exports = router;
