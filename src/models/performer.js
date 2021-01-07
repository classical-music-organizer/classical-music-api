const mongoose = require('mongoose')
const { ExpandableSchema } = require('./')
const { InfoSchema } = require('./info')

const MODEL_NAME = 'performer'

const PerformerSchema = ExpandableSchema(MODEL_NAME, {
  name: {
    title: String,
    first: {type: String, required: true},
    last: {type: String, required: true},
    middle: String,
    suffix: String,
    nick: String
  },
  info: InfoSchema
}, {
  performances: {
    ref: 'performance',
    localField: '_id',
    foreignField: 'performers'
  }
})

// fields to search composer on
// TODO: research the limit of text index field size. these fields combined could become very large
const textIndexFields = [
  'name.title',
  'name.first',
  'name.last',
  'name.middle',
  'name.suffix',
  'name.nick'
].concat(InfoSchema.textIndexFields.map(f => `info.${f}`))

// turns fields array ['example'] to {example: 'test'} for mongoose index method
const textIndexObj = textIndexFields.reduce((obj, field) => Object.assign(obj, {[field]: 'text'}), {})

// create text index for search
PerformerSchema.index(textIndexObj, {
  name: 'search',
  weights: { // TODO: adjust weights to improve search performance
    'name.last': 2
  }
})

const Performer = mongoose.model(MODEL_NAME, PerformerSchema)

module.exports = {Performer, PerformerSchema}