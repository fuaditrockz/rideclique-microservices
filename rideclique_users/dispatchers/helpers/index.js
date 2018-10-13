const simplecrypt     = require("simplecrypt")

// Responsers
const {
  errorResponse, 
  successResponseWithData, 
  successResponseWithoutData
} = require('../responsers')

exports.checkEmail = email => {
  return new Promise((resolve, reject) => {
    return email.length
			? reject(errorResponse("Email already exists", 409))
			: resolve(email)
  })
}

exports.generatePassword = data => {
	return simplecrypt.encrypt(data.password)
}