const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  async generateToken() {
    return new Promise((res, rej) => {
      jwt.sign({}, config.jwtSecret, {expiresIn: config.jwtExpire}, (err, token) => {
        if (err) return rej(err)

        res(token)
      })
    })
  }
}

module.exports = AuthService