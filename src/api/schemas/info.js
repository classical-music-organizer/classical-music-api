const InfoSchema = {
  type: 'object',
  properties: {
    content: {type: 'string'}
  },
  required: ['content'],
  additionalProperties: false
}

module.exports = InfoSchema