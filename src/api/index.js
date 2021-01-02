const router = require('express-promise-router')()
const composer = require('./routes/composer')
const work = require('./routes/work')

const { errorHandler, NotFoundError } = require('./middleware/errors')

const routes = () => {
  composer(router)
  work(router)

  // return 404 for undefined routes
  router.use('*', () => {
    throw new NotFoundError()
  })

  return router
}

module.exports = { routes, errorHandler }