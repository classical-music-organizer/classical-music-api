const Ajv = require('ajv').default
const ajv = new Ajv()

// Extended vocabulary for model schemas
ajv.addVocabulary([
  {
    keyword: 'expandable',
    type: ['string', 'array'], // string ids and arrays of ids can be expandable
    schemaType: 'boolean'
  },
  {
    keyword: 'object',
    type: ['string', 'array'],
    schemaType: 'string'
  }
])

module.exports = ajv