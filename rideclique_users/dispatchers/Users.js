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
  users_definition
} = require('./definitions/users')

exports.getAllUsers = () => {
  return knex('users')
    .select('*')
    .then(res => res.map(r => ({
      ...r, 
      bod: momentTimeZone(r.bod).tz('Asia/Jakarta').format(),
      created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format(),
    })))
    .then(res => NestHydrationJS.nest(res, users_definition))
    .then(res => successResponseWithData(res, "Success GET Users", 200))
    .catch(err => errorResponse(err, 500))
}

exports.getUserById = id => {
  const GET_USER_BY_ID = requestId => {
    return new Promise((resolve, reject) => {
      requestId
        ? resolve(requestId)
        : reject(errorResponse("Fields cannot be null.", 400)) 
    })
  }

  const checkId = requestId => {
    return knex("users")
      .where("users.id", requestId)
      .returning("id")
      .then(res => res)
			.catch(err => errorResponse(`Internal Server Error ${err}`, 500))
  }

  const pushResult = (response) => {
    if (response.length) {
      return knex('users')
        .select('*')
        .where("users.id", id)
        .then(res => res.map(r => ({
          ...r, 
          bod: momentTimeZone(r.bod).tz('Asia/Jakarta').format(),
          created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format(),
        })))
        .then(res => NestHydrationJS.nest(res, users_definition))
        .then(res => successResponseWithData(res, `Success GET ID: ${id}`, 200))
        .catch(err => errorResponse(err, 500))
    } else {
      return errorResponse(`ID ${id} not found.`, 404)
    }
  }

  return GET_USER_BY_ID(id)
      .then(res => checkId(res))
      .then(res => pushResult(res))
      .catch(err => errorResponse(err, 500))
}

exports.updateUserById = (id, data) => {
  
}