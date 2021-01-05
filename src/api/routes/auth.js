const route = require('express-promise-router')()
const { authenticateAdmin, isAdmin } = require('../middleware/auth')
const AuthService = require('../../services/auth')

module.exports = (router) => {
  router.use(route)

  route.post('/authenticate', authenticateAdmin, async (req, res) => {
    const jwt = await AuthService.generateToken()

    res.json({access_token: jwt})
  })
}