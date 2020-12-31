const { ModelFactory, InfoSchema } = require('./');

const ComposerSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {
        title: {type: 'string'},
        first: {type: 'string'},
        middle: {type: 'string'},
        suffix: {type: 'string'},
        nick: {type: 'string'}
      },
      required: ['first', 'last'],
      additionalProperties: false
    },
    catalog: {type: 'string', expandable: true, object: 'catalog'}, // id
    works: {
      type: 'array',
      items: {type: 'string'}, // ids
      expandable: true,
      object: 'work'
    },
    info: InfoSchema
  },
  required: ['name', 'works', 'info'],
  additionalProperties: false
};

const Composer = ModelFactory('composer', ComposerSchema);

module.exports = {Composer, ComposerSchema};