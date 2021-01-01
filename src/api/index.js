const { Router } = require('express');
const composer = require('./routes/composer');

module.exports = () => {
	const router = Router();
	composer(router);

	return router
}