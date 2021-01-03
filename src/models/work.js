const mongoose = require('mongoose')
const { ExpandableSchema } = require('./')
const { InfoSchema } = require('./info')
const { MovementSchema } = require('./movement')

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
  info: InfoSchema
})

const Work = mongoose.model(MODEL_NAME, WorkSchema)

module.exports = {Work, WorkSchema}