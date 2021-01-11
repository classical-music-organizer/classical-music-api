const InfoSchema = require('./info')
const MovementSchema = require('./movement')

// req is a bool that turns required fields on or off; used to generate a POST or PATCH schema
const WorkSchema = req => {
  return {
    type: 'object',
    properties: {
      name: {type: 'string'},
      composer: {type: 'string'},
      movements: {
        type: 'array',
        items: MovementSchema
      },
      catalog: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          no: {type: 'string'}
        },
        additionalProperties: false
      },
      info: InfoSchema,
      tags: {
        type: 'array',
        items: {type: 'string'} // id's of tags
      }
    },
    required: req ? ['name', 'composer', 'info'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = WorkSchema(true)
const PatchSchema = WorkSchema(false)

const ListSchema = {
  type: 'object',
  properties: {
    composer: {type: 'string'}, // TODO: enforce ID format
    limit: {type: 'integer'}, // TODO: positive
    start: {type: 'integer'} // TODO: positive
  }
}

const RetrieveSchema = {
  type: 'object',
  properties: {
    populateTags: {type: 'boolean'}
  }
}

module.exports = { WorkSchema, PostSchema, PatchSchema, ListSchema, RetrieveSchema }