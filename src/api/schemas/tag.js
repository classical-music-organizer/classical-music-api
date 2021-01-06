const TagSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'}
  },
  required: ['name'],
  additionalProperties: false
}

// schema for query parameters
const ListSchema = {
  type: 'object',
  properties: {
    limit: {type: 'integer'}, // TODO: positive
    start: {type: 'integer'} // TODO: positive
  }
}

module.exports = { TagSchema, ListSchema }