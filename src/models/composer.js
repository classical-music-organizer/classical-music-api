const mongoose = require('mongoose')
const { Schema } = mongoose
const { InfoSchema } = require('./info')
const { generateId } = require('./')

const ComposerSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
  name: {
    title: String,
    first: {type: String, required: true},
    last: {type: String, required: true},
    middle: String,
    suffix: String,
    nick: String
  },
  info: InfoSchema,
  catalog: String
})

ComposerSchema.method('toClient', function() {
  let obj = this.toObject()

  const id = obj._id
  const object = 'composer'

  if (obj.info) obj.info = this.info.toClient()

  const prune = ({name, info, catalog}) => ({id, object, name, info, catalog})
  obj = prune(obj)

  if (this.$locals.deleted) {
    obj.deleted = true
  }

  return obj
})

const Composer = mongoose.model('composer', ComposerSchema)

module.exports = {Composer, ComposerSchema}