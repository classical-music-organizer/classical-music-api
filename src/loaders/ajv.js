const Ajv = require('ajv').default
const ajv = new Ajv()
const ajvCoerce = new Ajv({coerceTypes: true})

module.exports = { ajv, ajvCoerce }