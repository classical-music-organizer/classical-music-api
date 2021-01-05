const jwt = require('jsonwebtoken')
const config = require('../../config')
const { bodyValidator } = require('./validation')

const { AuthenticationError } = require('./errors')
const { TokenExpiredError } = jwt

const AdminSchema = {
  type: 'object',
  properties: {
    username: {type: 'string'},
    password: {type: 'string'}
  },
  required: ['username', 'password'],
  additionalProperties: false
}

// Admin user/pass authentication
const authenticateAdmin = (req, res, next) => {
  bodyValidator(AdminSchema)(req, res, err => {
    if (err) return next(err)

    const { username, password } = req.body

    if (username == config.adminUsername && password == config.adminPassword) {
      return next()
    }

    next(new AuthenticationError('Invalid username or password.'))
  })
}

// Validate admin token
const isAdmin = (req, res, next) => {
  if (!req.token) return next(new AuthenticationError('Missing authentication token.'))

  jwt.verify(req.token, config.jwtSecret, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) return next(new AuthenticationError('Token expired.'))
      
      return next(new AuthenticationError('Invalid token.'))
    }

    req.user = decoded
    next()
  })
}

module.exports = { authenticateAdmin, isAdmin }