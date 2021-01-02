const mongoose = require('mongoose')
const { Schema } = mongoose

// TODO: provide structure for paragraphs/heading (markdown?)
const InfoSchema = new Schema({
  content: String
})

module.exports = { InfoSchema }