// Outer Module
const configuration   = require('../knexfile').development
const knex            = require('knex')(configuration)
const NestHydrationJS = require('nesthydrationjs')()
const momentTimeZone  = require('moment-timezone')

// Responsers
const {
  errorResponse, 
  successResponseWithData, 
  successResponseWithoutData
} = require('./responsers')

// Definitions
const {
  brands_definition
} = require('./definitions/brands')

// Helpers
const {
  generatePassword
} = require('./helpers')

exports.getAllBrands = () => {
  return knex('brands')
    .select('*')
    .then(res => res.map(r => ({
      ...r, 
      created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format(),
    })))
    .then(res => NestHydrationJS.nest(res, brands_definition))
    .then(res => successResponseWithData(res, "Success GET Brands", 200))
    .catch(err => errorResponse(err, 500))
}
