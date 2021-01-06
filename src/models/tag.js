const mongoose = require('mongoose')
const { Schema } = mongoose
const { generateId } = require('./')

const MODEL_NAME = 'tag'

const TagSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
  name: String,
  slug: String
})

TagSchema.method('toClient', function() {
  let obj = this.toObject()
  
  const id = obj._id
  const object = MODEL_NAME

  const prune = ({name, slug}) => ({id, object, name, slug})

  const newObj = prune(obj)

  if (this.$locals.deleted) newObj.deleted = true

  return newObj
})

const Tag = mongoose.model(MODEL_NAME, TagSchema)

module.exports = { Tag, TagSchema }