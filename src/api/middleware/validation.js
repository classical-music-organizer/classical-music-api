const ajv = require('../../loaders/ajv')
const { BadRequestError, ValidationError } = require('./errors')

const bodyValidator = schema => {
  const validator = ajv.compile(schema)

  return (req, res, next) => {
    const valid = validator(req.body)

    if (valid) return next()

    throwValidationError(validator.errors)
  }
}

const queryValidator = schema => {
  const validator = ajv.compile(schema)

  return (req, res, next) => {
    const valid = validator(req.query)

    if (valid) return next()

    throwValidationError(validator.errors)
  }
}

// Throws request error corresponding to AJV validator errors
const throwValidationError = errors => {
  if (!validator.errors || !validator.errors[0]) return

  const err = validator.errors[0]

  if (err.keyword == 'additionalProperties') {
    const prop = err.params.additionalProperty

    throw new BadRequestError(`Unknown property '${prop}' in body.`, prop)
  } else if (err.keyword == 'required') {
    const prop = err.params.missingProperty

    throw new BadRequestError(`Missing required property '${prop}'.`, prop)
  } else if (err.keyword == 'type') {
    const type = err.params.type

    // convert json-schema path /prop/nestedProp to prop.nestedProp
    const path = err.dataPath.slice(1).split('/').join('.') // TODO: test this; especially for arrays

    throw new ValidationError(`Expected '${path}' to be of type '${type}'.`, path)
  }

  // TODO: add more validation cases

  throw new ValidationError() // default validation error
}

module.exports = { bodyValidator, queryValidator }