module.exports = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,

  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE
}