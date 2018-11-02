require('dotenv').config({path: '../.env'})

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_DEV,
      user: 'fuadit',
      password: process.env.PASSWORD,
      database: 'rideclique',
      charset: 'utf8'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: '35.240.209.45',
      user: 'root',
      password: process.env.PASSWORD,
      database: 'cafemates',
      charset: 'utf8'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      host: '35.240.209.45',
      user: 'root',
      password: process.env.PASSWORD,
      database: 'cafemates',
      charset: 'utf8'
    }
  }
};