const router = require('express-promise-router')();
const composer = require('./routes/composer');

const { errorHandler, NotFoundError } = require('./middleware/errors')

const routes = () => {
	composer(router);

	// return 404 for undefined routes
	router.use('*', () => {
		throw new NotFoundError()
	})

	return router
}

module.exports = { routes, errorHandler }