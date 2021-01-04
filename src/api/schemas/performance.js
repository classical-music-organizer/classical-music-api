const InfoSchema = require('./info')

// req is a bool that turns required fields on or off; used to generate a POST or PATCH schema
const PerformanceSchema = req => {
  return {
    type: 'object',
    properties: {
      work: {type: 'string'},
      performers: {
        type: 'array',
        items: {type: 'string'} // id's of performers
      },
      source: {
        type: 'object',
        properties: {
          provider: {type: 'string'}, // TODO: enforce provider enum
          link: {type: 'string'}
        },
        required: ['provider', 'link'],
        additionalProperties: false
      },
      isFullPerformance: {type: 'boolean'},
      info: InfoSchema,
    },
    required: req ? ['work', 'performers', 'source', 'isFullPerformance', 'info'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = PerformanceSchema(true)
const PatchSchema = PerformanceSchema(false)

// schema for query parameters
const ListSchema = {
  type: 'object',
  properties: {
    limit: {type: 'integer'}, // TODO: positive
    start: {type: 'integer'} // TODO: positive
  }
}

module.exports = { PerformanceSchema, PostSchema, PatchSchema, ListSchema }