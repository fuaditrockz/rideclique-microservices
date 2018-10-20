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
  cars_definition
} = require('./definitions/cars')

// Helpers
const {
  generatePassword
} = require('./helpers')

const now = momentTimeZone().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

exports.getAllCars = () => {
      return knex('cars')
        .leftJoin('brands', { 'brands.id' : 'cars.brand_id'  })
        .leftJoin('users_cars', { 'users_cars.car_id' : 'cars.id' })
        .leftJoin('users', { 'users.id' : 'users_cars.user_id' })
        .select(
          'cars.id',
          'cars.name',
          'cars.type',
          'brands.name as brand',
          'cars.year',
          'users.firstname as owner',
          'cars.created_at',
          'cars.updated_at'
        )
        .then(res => res.map(r => ({
          ...r,
          updated_at: momentTimeZone(r.updated_at).tz('Asia/Jakarta').format(),
          created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format()
        })))
        .then(res => NestHydrationJS.nest(res, cars_definition))
        .then(res => successResponseWithData(res, "Success GET Cars", 200))
        .catch(err => errorResponse(err, 500))
}

exports.getCarById = id => {
      const GET_CAR_BY_ID = requestId => {
        return new Promise((resolve, reject) => {
          requestId
            ? resolve(requestId)
            : reject(errorResponse("Fields cannot be null", 400))
        })
      }

      const checkId = requestId => {
        return knex("cars")
          .where("cars.id", requestId)
          .returning("id")
          .then(res => res)
    			.catch(err => errorResponse(`Internal Server Error ${err}`, 500))
      }

      const pushResult = response => {
        if (response.length) {
          return knex('cars')
            .leftJoin('brands', { 'brands.id' : 'cars.brand_id'  })
            .leftJoin('users_cars', { 'users_cars.car_id' : 'cars.id' })
            .leftJoin('users', { 'users.id' : 'users_cars.user_id' })
            .select(
              'cars.id',
              'cars.name',
              'cars.type',
              'brands.name as brand',
              'cars.year',
              'users.firstname as owner',
              'cars.created_at',
              'cars.updated_at'
            )
            .where("cars.id", id)
            .then(res => res.map(r => ({
              ...r,
              updated_at: momentTimeZone(r.updated_at).tz('Asia/Jakarta').format(),
              created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format()
            })))
            .then(res => NestHydrationJS.nest(res, cars_definition))
            .then(res => successResponseWithData(res, `Success GET ID: ${id}`, 200))
            .catch(err => errorResponse(err, 500))
        } else {
          return errorResponse(`ID ${id} not found.`, 404)
        }
      }

      return GET_CAR_BY_ID(id)
          .then(res => checkId(res))
          .then(res => pushResult(res))
          .catch(err => errorResponse(err, 500))
}

exports.addNewCar = data => {
  const CHECK_INPUT = item => {
    return new Promise((resolve, reject) => {
      item.name && item.type && item.brand
        ? resolve(item)
        : reject(errorResponse(`Check Input - Internal Server Error: ${err}`, 500))
    })
  }

  const knexResponse = brand => {
    return knex('brands')
      .where('name', brand)
      .returning('id')
      .then(res => res)
      .catch(err => errorResponse(`Search Brand - Internal Server Error: ${err}`, 500))
  }

  const insertCarToDB = (response, item) => {
    if(response.length) {
      return knex('cars')
        .insert({
          name: item.name,
          type: item.type,
          brand_id: response[0].id,
          year: item.year,
          created_at: now,
          updated_at: now
        })
        .returning('id')
        .then(id => successResponseWithData(id, "Add New Car Success", 201))
        .catch(err => errorResponse(`Insert Car to DB - Internal server error: ${err}`, 500))
    } else {
      return errorResponse(`Brand: ${item.brand} is undefined`, 404)
    }
  }

  return CHECK_INPUT(data)
      .then(res => knexResponse(res.brand))
      .then(res => insertCarToDB(res, data))
      .catch(err => errorResponse(err, 500))
}

exports.updateCarById = (id, data) => {
  return knex('cars')
    .where('id', id)
    .update({
      name: data.name,
      type: data.type,
      brand_id: data.brand,
      year: data.year,
      updated_at: now
    })
    .returning('id')
    .then(res => successResponseWithData(res, `Success Update Car ID: ${id}`, 201))
}

exports.deleteCar = id => {
  return knex('cars')
      .where('id', id)
      .del()
      .then(res => successResponseWithoutData(res, "Delete Car Success", 200))
      .catch(err => errorResponse(`Delete Car in DB - Internal server error: ${err}`, 500))
}
