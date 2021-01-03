const MovementSchema = {
  type: 'object',
  properties: {
    order: {type: 'integer'},
    name: {type: 'string'}
  },
  required: ['order', 'name'],
  additionalProperties: false
}

module.exports = MovementSchema