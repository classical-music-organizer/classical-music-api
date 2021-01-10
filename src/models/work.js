const mongoose = require('mongoose')
const { ExpandableSchema } = require('./')
const { InfoSchema } = require('./info')
const { MovementSchema } = require('./movement')
const { TagSchema } = require('./tag')

const MODEL_NAME = 'work'

const WorkSchema = ExpandableSchema('work', {
  composer: {
    type: String,
    required: true,
    ref: 'composer'
  },
  name: {type: String, required: true},
  movements: [MovementSchema], // TODO: validate that order property on movement is unique within work doc
  catalog: {
    name: String,
    no: String
  },
  info: InfoSchema,
  tags: [TagSchema],
  slug: String
})

// fields to search composer on
// TODO: is it possible for a doc to be searchable by an external reference like composer name?
const textIndexFields = [
  'name',
  'catalog'
].concat(InfoSchema.textIndexFields.map(f => `info.${f}`))
 .concat(TagSchema.textIndexFields.map(f => `tags.${f}`))
 .concat(MovementSchema.textIndexFields.map(f => `movements.${f}`))

// turns fields array ['example'] to {example: 'test'} for mongoose index method
const textIndexObj = textIndexFields.reduce((obj, field) => Object.assign(obj, {[field]: 'text'}), {})

// create text index for search
WorkSchema.index(textIndexObj, {
  name: 'search',
  weights: { // TODO: adjust weights to improve search performance
    'name': 5
  }
})

const Work = mongoose.model(MODEL_NAME, WorkSchema)

module.exports = {Work, WorkSchema}