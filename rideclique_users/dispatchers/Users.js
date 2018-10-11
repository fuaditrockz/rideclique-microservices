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
  return knex("users")
      .where("id", id)
      .update({
        firstname: data.firstname,
        lastname: data.lastname,
        phone_number: data.phonenumber,
        gender: data.gender,
        bod: data.bod,
        country_id: data.country,
        region_id: data.region,
        city_id: data.city
      })
      .returning("id")
      .then(res => successResponseWithData(res,"Success Update User", 201))
		  .catch(err => errorResponse(err, 500))
}

exports.registerNewUser = (data) => {
  const CHECK_INPUT = item => {
    return new Promise((resolve, reject) => {
      item.firstname && item.lastname && item.email && item.username && item.password
        ? resolve(item)
        : reject(errorResponse(`Check Input => Internal Server Error: ${err}`, 500))
    })
  }

  const knexResponse = email => {
    return knex('users')
      .where('email', email)
      .returning('id')
      .then(res => res)
      .catch(err => errorResponse(`Search Email - Internal Server Error: ${err}`, 500))
  }

  const insertUserToDB = (response, data) => {
    if (response.length) {
      return errorResponse('Email is already exist.', 409)
    } else {
      const processInput = item => {
        return new Promise((resolve, reject) => {
          item ? resolve(item) : reject(errorResponse(`Check Input - Internal Server Error: ${err}`, 500))
        }) 
      }

      const registerUser = (item, hashPassword) => {
        return knex("users")
          .insert({
            firstname: item.firstname,
            lastname: item.lastname,
            email: item.email,
            username: item.username,
            password: hashPassword
          })
          .returning("id")
          .then(id => successResponseWithData(id, "Register Success", 201))
          .catch(err => errorResponse(`Insert User to DB - Internal server error: ${err}`, 500))   
      }

      return processInput(data)
            .then(res => generatePassword(res))
            .then(hashPassword => registerUser(data, hashPassword))
            .catch(err => errorResponse(err, 500))
    }
  }

  return CHECK_INPUT(data)
      .then(res => knexResponse(res.email))
      .then(res => insertUserToDB(res, data))
      .catch(err => errorResponse(err, 500))
}