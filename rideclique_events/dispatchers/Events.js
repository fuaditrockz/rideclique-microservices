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
  events_definition
} = require('./definitions/events')

// Helpers
const {
  generatePassword
} = require('./helpers')

const now = momentTimeZone().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

exports.getAllEvents = () => {
  return knex('events')
    .leftJoin('users_events', { 'users_events.event_id' : 'events.id' })
    .leftJoin('users_join_events', { 'users_join_events.event_id' : 'events.id' })
    .leftJoin('users as owner', { 'owner.id' : 'users_events.user_id' })
    .leftJoin('users as participant', { 'participant.id' : 'users_join_events.user_id' })
    .select(
      'events.id',
      'events.name',
      'events.description',
      'events.event_date',
      'events.venue',
      'events.country_id',
      'events.region_id',
      'events.city_id',
      'events.latitude',
      'events.longitude',
      'events.contact_phone',
      'events.contact_email',
      'events.photo_thumbnail_url',
      'events.photo_url',
      'events.event_type',
      'events.created_at',
      'events.updated_at',

      'owner.firstname as owner',
      'participant.firstname as participant'
    )
    .then(res => res.map(r => ({
      ...r,
      created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format(),
      updated_at: momentTimeZone(r.updated_at).tz('Asia/Jakarta').format()
    })))
    .then(res => NestHydrationJS.nest(res, events_definition))
    .then(res => successResponseWithData(res, "Success GET ALL Events", 200))
    .catch(err => errorResponse(err, 500))
}

exports.getEventById = id => {
  const GET_EVENT_BY_ID = requestId => {
    return new Promise((resolve, reject) => {
      requestId
        ? resolve(requestId)
        : reject(errorResponse("Fields cannot be null", 400))
    })
  }

  const checkId = requestId => {
    return knex("events")
      .where("events.id", requestId)
      .returning("id")
      .then(res => res)
      .catch(err => errorResponse(`Internal Server Error ${err}`, 500))
  }

  const pushResult = response => {
    if (response.length) {
      return knex('events')
        .leftJoin('users_events', { 'users_events.event_id' : 'events.id' })
        .leftJoin('users_join_events', { 'users_join_events.event_id' : 'events.id' })
        .leftJoin('users as owner', { 'owner.id' : 'users_events.user_id' })
        .leftJoin('users as participant', { 'participant.id' : 'users_join_events.user_id' })
        .select(
          'events.id',
          'events.name',
          'events.description',
          'events.event_date',
          'events.venue',
          'events.country_id',
          'events.region_id',
          'events.city_id',
          'events.latitude',
          'events.longitude',
          'events.contact_phone',
          'events.contact_email',
          'events.photo_thumbnail_url',
          'events.photo_url',
          'events.event_type',
          'events.created_at',
          'events.updated_at',

          'owner.firstname as owner',
          'participant.firstname as participant'
        )
        .where("events.id", id)
        .then(res => res.map(r => ({
          ...r,
          created_at: momentTimeZone(r.created_at).tz('Asia/Jakarta').format(),
          updated_at: momentTimeZone(r.updated_at).tz('Asia/Jakarta').format()
        })))
        .then(res => NestHydrationJS.nest(res, events_definition))
        .then(res => successResponseWithData(res, `Success GET Event ID: ${id}`, 200))
        .catch(err => errorResponse(err, 500))
    } else {
      return errorResponse(`ID Event ${id} not found.`, 404)
    }
  }

  return GET_EVENT_BY_ID(id)
      .then(res => checkId(res))
      .then(res => pushResult(res))
      .catch(err => errorResponse(err, 500))
}

exports.addNewEvent = data => {
  const CHECK_INPUT = item => {
    return new Promise((resolve, reject) => {
      item.name
        ? resolve(item)
        : reject(errorResponse(`Check Input - Internal Server Error: ${err}`, 500))
    })
  }

  const getPlace = response => {
    return knex('cities')
      .where("id", response.city)
      .select(
        'cities.id',
        'cities.name',
        'cities.country_id',
        'cities.region_id'
      )
      .returning('id')
      .then(res => res)
      .catch(err => errorResponse(`City is not found : ${err}`, 500))
  }

  const insertEventToDB = (item, response) => {
    return knex('events')
      .insert({
        name: item.name,
        description: item.description,
        event_date: item.event_date,
        venue: item.venue,
        country_id: response[0].country_id,
        region_id: response[0].region_id,
        city_id: response[0].id,
        latitude: item.latitude,
        longitude: item.longitude,
        contact_phone: item.contact_phone,
        contact_email: item.contact_email,
        photo_url: item.photo_url,
        photo_thumbnail_url: item.photo_thumbnail_url
      })
      .returning('id')
      .then(id => successResponseWithData(id, "Add New Event Success", 201))
      .catch(err => errorResponse(`Insert Event to DB - Internal server error: ${err}`, 500))
  }

  return CHECK_INPUT(data)
      .then(res => getPlace(res))
      .then(res => insertEventToDB(data, res))
      .catch(err => errorResponse(err, 500))
}
