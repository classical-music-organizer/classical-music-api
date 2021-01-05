// TODO: load from env file

module.exports = {
  dbUrl: 'mongodb://localhost:27017/classical-music-dev',
  port: 3000,

  adminUsername: 'admin', // Tricky username and password
  adminPassword: 'password',

  jwtSecret: 'prokofiev',
  jwtExpire: 4 * 60 * 60 // JWTs expire every 4 hours
}