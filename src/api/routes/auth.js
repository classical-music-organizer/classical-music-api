const route = require('express-promise-router')()
const { authLocal } = require('../middleware/auth')
const AuthService = require('../../services/auth')

module.exports = (router) => {
  router.use(route)

  route.post('/authenticate', authLocal, async (req, res) => {
    const jwt = await AuthService.signJwt(req.user.username)

    res.json({token: jwt})
  })
}