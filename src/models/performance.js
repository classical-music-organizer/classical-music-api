const mongoose = require('mongoose')
const { ExpandableSchema } = require('./')
const { InfoSchema } = require('./info')

const MODEL_NAME = 'performance'

const PerformanceSchema = ExpandableSchema(MODEL_NAME, {
  work: {
    type: String,
    required: true,
    ref: 'composer'
  },
  performers: [{ // id's of performers
    type: String,
    required: true,
    ref: 'performer'
  }],
  source: {
    provider: {type: String, required: true}, // TODO: enum of possible providers e.g. youtube
    link: {type: String}
  },
  isFullPerformance: {type: Boolean},
  info: InfoSchema
})

const Performance = mongoose.model(MODEL_NAME, PerformanceSchema)

module.exports = {Performance, PerformanceSchema}