const mongoose = require('mongoose')
const { generateId } = require('./')
const { Schema } = mongoose
const { InfoSchema } = require('./info')
const { MovementSchema } = require('./movement')

const WorkSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
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

WorkSchema.method('toClient', function() {
  let obj = this.toObject()

  const id = obj._id
  const object = 'work'

  if (obj.info) obj.info = this.info.toClient()
  if (obj.movements) obj.movements = this.movements.map(m => m.toClient())
  if (this.populated('composer')) obj.composer = this.composer.toClient()

  const prune = ({composer, name, movements, catalog, info}) =>
    ({id, object, composer, name, movements, catalog, info})
  
  obj = prune(obj)

  if (this.$locals.deleted) {
    obj.deleted = true
  }

  return obj
})

const Work = mongoose.model('work', WorkSchema)

module.exports = {Work, WorkSchema}