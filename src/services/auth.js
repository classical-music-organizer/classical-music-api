const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  async signJwt(username) {
    return new Promise((res, rej) => {
      const payload = {sub: username}

      jwt.sign(payload, config.jwtSecret, {expiresIn: config.jwtExpire}, (err, encoded) => {
        if (err) return rej(err)

        res(encoded)
      })
    })
  }
}

module.exports = AuthService