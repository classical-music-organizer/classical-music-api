const mongoose = require('mongoose')
const config = require('../config')

module.exports = {
  connect() {
    mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  }
}