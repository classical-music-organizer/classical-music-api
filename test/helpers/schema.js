const Ajv = require('ajv').default
const ajv = new Ajv()

// appends additional required response properties not included in the object schema
const toObjectResponseSchema = (schema) => {
  return {
    ...schema,
    properties: {
      ...(schema.properties),
      object: {type: 'string'}
    },
    required: schema.required ? schema.required.concat('object') : ['object']
  }
}

// appends deleted property to object response schema
const toDeleteResponseSchema = (schema) => {
  return {
    ...schema,
    properties: {
      ...(schema.properties),
      deleted: {type: 'boolean'}
    },
    required: schema.required ? schema.required.concat('deleted') : ['deleted']
  }
}

// info for composers, works, and sets, e.g. biographical info or musical style
// TODO: create structure that supports heading and paragraph rendering
const InfoSchema = {
  type: 'string'
}

// musical catalog such as BWV (Bach) or WoO (Beethoven)
// TODO: design data structure for catalog
const CatalogSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'}
  },
  required: ['id', 'name'],
  additionalProperties: false
}

// TODO: complete work schema
const WorkSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'}
  },
  additionalProperties: false
}

const ComposerSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
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
    catalog: CatalogSchema,
    works: {
      type: 'array',
      items: WorkSchema
    },
    info: InfoSchema
  },
  required: ['id', 'name', 'works', 'info'],
  additionalProperties: false
}

module.exports = {
  ajv,
  toObjectResponseSchema,
  toDeleteResponseSchema,
  InfoSchema,
  CatalogSchema,
  WorkSchema,
  ComposerSchema
}