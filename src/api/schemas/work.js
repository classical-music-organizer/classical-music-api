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
      info: InfoSchema
    },
    required: req ? ['name', 'composer', 'info'] : undefined,
    additionalProperties: false
  }
}

const PostSchema = WorkSchema(true)
const PatchSchema = WorkSchema(false)

module.exports = { WorkSchema, PostSchema, PatchSchema }