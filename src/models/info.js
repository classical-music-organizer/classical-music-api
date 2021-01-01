const mongoose = require('mongoose')
const { Schema } = mongoose

const InfoSchema = new Schema({
  content: String
})

module.exports = { InfoSchema }