const mongoose = require('mongoose')
const { Schema } = mongoose
const { generateId } = require('./')

const MovementSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
  name: {type: String, required: true},
  order: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
})

MovementSchema.method('toClient', function() {
  let obj = this.toObject()

  const id = obj._id
  const object = 'movement'

  const prune = ({name, order}) => ({id, object, name, order})
  
  obj = prune(obj)

  if (this.$locals.deleted) {
    obj.deleted = true
  }

  return obj
})

module.exports = { MovementSchema }