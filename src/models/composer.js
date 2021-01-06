const mongoose = require('mongoose')
const { InfoSchema } = require('./info')
const { TagSchema } = require('./tag')
const { ExpandableSchema } = require('./')

const MODEL_NAME = 'composer'

const ComposerSchema = ExpandableSchema(MODEL_NAME, {
  name: {
    title: String,
    first: {type: String, required: true},
    last: {type: String, required: true},
    middle: String,
    suffix: String,
    nick: String
  },
  info: InfoSchema,
  catalog: String,
  tags: [TagSchema]
}, {
  works: {
    ref: 'work',
    localField: '_id',
    foreignField: 'composer',
  }
})

const Composer = mongoose.model(MODEL_NAME, ComposerSchema)

module.exports = {Composer, ComposerSchema}