const mongoose = require('mongoose')
const { generateId } = require('./')
const { Schema } = mongoose

const InfoSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
  content: String
})

InfoSchema.method('toClient', function() {
  let obj = this.toObject()

  const id = obj._id
  const object = 'info'

  const prune = ({content}) => ({id, object, content})
  
  obj = prune(obj)

  if (this.$locals.deleted) {
    obj.deleted = true
  }

  return obj
})

// fields that info should be searched on
InfoSchema.textIndexFields = ['content']

module.exports = { InfoSchema }