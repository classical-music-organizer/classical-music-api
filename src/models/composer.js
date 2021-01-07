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
  },
  fullName: {} // we mark the virtual here so it gets added to the client response
})

// combines all names contained in name object
ComposerSchema.virtual('fullName').get(function() {
  const {title, first, middle, last, suffix} = this.name

  return [title, first, middle, last, suffix].filter(str => !!str).join(' ')
})

// fields to search composer on
// TODO: research the limit of text index field size. these fields combined could become very large
const textIndexFields = [
  'name.title',
  'name.first',
  'name.last',
  'name.middle',
  'name.suffix',
  'name.nick',
  'catalog'
].concat(InfoSchema.textIndexFields.map(f => `info.${f}`))
 .concat(TagSchema.textIndexFields.map(f => `tags.${f}`))

// turns fields array ['example'] to {example: 'test'} for mongoose index method
const textIndexObj = textIndexFields.reduce((obj, field) => Object.assign(obj, {[field]: 'text'}), {})

// create text index for search
ComposerSchema.index(textIndexObj, {
  name: 'search',
  weights: { // TODO: adjust weights to improve search performance
    'name.last': 2
  }
})

const Composer = mongoose.model(MODEL_NAME, ComposerSchema)

module.exports = {Composer, ComposerSchema}