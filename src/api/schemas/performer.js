const InfoSchema = require('./info')

// req is a bool that turns required fields on or off; used to generate a POST or PATCH schema
const PerformerSchema = req => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          first: {type: 'string'},
          last: {type: 'string'},
          middle: {type: 'string'},
          suffix: {type: 'string'},
          nick: {type: 'string'}
        },
        required: ['first', 'last'],
        additionalProperties: false
      },
      info: InfoSchema,
    },
    required: req ? ['name', 'info'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = PerformerSchema(true)
const PatchSchema = PerformerSchema(false)

// schema for query parameters
const ListSchema = {
  type: 'object',
  properties: {
    limit: {type: 'integer'}, // TODO: positive
    start: {type: 'integer'} // TODO: positive
  }
}

module.exports = { PerformerSchema, PostSchema, PatchSchema, ListSchema }