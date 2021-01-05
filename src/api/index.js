const router = require('express-promise-router')()
const auth = require('./routes/auth')
const composer = require('./routes/composer')
const work = require('./routes/work')
const performance = require('./routes/performance')
const performer = require('./routes/performer')

const { errorHandler, NotFoundError } = require('./middleware/errors')

const routes = () => {
  auth(router)
  composer(router)
  work(router)
  performance(router)
  performer(router)

  // return 404 for undefined routes
  router.use('*', () => {
    throw new NotFoundError()
  })

  return router
}

module.exports = { routes, errorHandler }