const config = require('../../config')
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Admin user/pass authentication
passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username == config.adminUsername && password == config.adminPassword) {
      return done(null, {username: config.adminUsername})
    }

    return done(null, false)
  })
)

// JWT verification
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}, (payload, done) => {
  done(null, payload) // TODO: when user schemas are defined, this should return the user object instead of jwt
}))

const authLocal = passport.authenticate('local', {session: false})
const authJwt = passport.authenticate('jwt', {session: false})

// this is redundant for now since all authenticated users will have admin rights
// but will be useful to discriminate between admins and general users later
const isAdmin = authJwt

module.exports = { authLocal, authJwt, isAdmin }