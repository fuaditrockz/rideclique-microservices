exports.errorResponse = (message, status) => ({
	name: "error",
	message: message,
	status: status
})

exports.successResponseWithData = (response, message, status) => ({
	name: "success",
	message: message,
	status: status,
	data: response
})

exports.successResponseWithoutData = (response, message, status) => ({
	name: "success",
	message: message,
	status: status,
	data: response
})
