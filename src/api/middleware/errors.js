class ServerError extends Error {
  constructor(type = 'internal', code = 500, message = 'An error occurred.', param) {
    super(message)

    this.type = type
    this.code = code
    this.message = message
    this.param = param
  }

  toJson() {
    const {type, code, message, param} = this

    return {
      type,
      code,
      message,
      param
    }
  }
}

class InternalError extends ServerError {
  constructor(message = 'An internal server error occured.', code = 500) {
    super('internal', code, message)
  }
}

class NotFoundError extends ServerError {
  constructor(message = 'The requested resource doesn\'t exist.') {
    super('invalid_request_error', 404, message)
  }
}

class BadRequestError extends ServerError {
  constructor(message, param) {
    if (!message && param) message = `Unknown property '${param}'.`
    if (!message) message = 'Request was invalid.'

    super('invalid_request_error', 400, message, param)
  }
}

class ValidationError extends ServerError {
  constructor(message, param) {
    if (!message && param) message = `There was a validation error on property '${param}'.`
    if (!message) message = 'There was a validation error.'

    super('invalid_request_error', 400, message, param)
  }
}

class AuthenticationError extends ServerError {
  constructor(message = 'Authentication error.') {
    super('authentication_error', 401, message)
  }
}

const errorHandler = (err, req, res, next) => {
  if (!err) return next()

  // TODO: log error?

  if (!(err instanceof ServerError)) {
    console.log('Interal Server Error: ', err) // TODO: use a logging library
    err = new InternalError() // hide real error from client
  }

  res.status(err.code).json(err.toJson())
  next()
}

module.exports = {
  errorHandler,
  ServerError,
  InternalError,
  NotFoundError,
  BadRequestError,
  ValidationError,
  AuthenticationError
}