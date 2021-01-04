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

const Performer = mongoose.model(MODEL_NAME, PerformerSchema)

module.exports = {Performer, PerformerSchema}