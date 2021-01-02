const config = require('./config')
const { app, mongooseUtil } = require('./loaders')

mongooseUtil.connect()

module.exports = app.listen(config.port, () => { 
  // TODO: do something after opening server
})