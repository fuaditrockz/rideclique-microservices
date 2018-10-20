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

const now = momentTimeZone().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

exports.getAllBrands = () => {
  return knex('brands')
    .select('*')
    .then(res => res.map(r => ({
      ...r,
      created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format()
    })))
    .then(res => NestHydrationJS.nest(res, brands_definition))
    .then(res => successResponseWithData(res, "Success GET ALL Brands", 200))
    .catch(err => errorResponse(err, 500))
}

exports.getBrandById = id => {
  const GET_BRAND_BY_ID = requestId => {
    return new Promise((resolve, reject) => {
      requestId
        ? resolve(requestId)
        : reject(errorResponse("Fields cannot be null", 400))
    })
  }

  const checkId = requestId => {
    return knex("brands")
      .where("brands.id", requestId)
      .returning("id")
      .then(res => res)
      .catch(err => errorResponse(`Internal Server Error ${err}`, 500))
  }

  const pushResult = response => {
    if (response.length) {
      return knex('brands')
        .select('*')
        .where("brands.id", id)
        .then(res => res.map(r => ({
          ...r,
          created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format()
        })))
        .then(res => NestHydrationJS.nest(res, brands_definition))
        .then(res => successResponseWithData(res, `Success GET Brand ID: ${id}`, 200))
        .catch(err => errorResponse(err, 500))
    } else {
      return errorResponse(`ID Brand ${id} not found.`, 404)
    }
  }

  return GET_BRAND_BY_ID(id)
      .then(res => checkId(res))
      .then(res => pushResult(res))
      .catch(err => errorResponse(err, 500))
}

exports.addNewBrand = data => {
  const CHECK_INPUT = item => {
    return new Promise((resolve, reject) => {
      item.name
        ? resolve(item)
        : reject(errorResponse(`Check Input - Internal Server Error: ${err}`, 500))
    })
  }

  const insertCarToDB = item => {
    return knex('brands')
      .insert({
        name: item.name,
        description: item.description,
        created_at: now
      })
      .returning('id')
      .then(id => successResponseWithData(id, "Add New Brand Success", 201))
      .catch(err => errorResponse(`Insert Brand to DB - Internal server error: ${err}`, 500))
  }

  return CHECK_INPUT(data)
      .then(res => insertCarToDB(res))
      .catch(err => errorResponse(err, 500))
}

exports.updateBrandById = (id, data) => {
  return knex('brands')
    .where('id', id)
    .update({
      name: data.name,
      description: data.description
    })
    .returning('id')
    .then(res => successResponseWithData(res, `Success Update Brand ID: ${id}`, 201))
}

exports.deleteBrand = id => {
  return knex('brands')
      .where('id', id)
      .del()
      .then(res => successResponseWithoutData(res, "Delete Brand Success", 200))
      .catch(err => errorResponse(`Delete Brand in DB - Internal server error: ${err}`, 500))
}
