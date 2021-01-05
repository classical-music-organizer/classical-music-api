const express = require('express')
const passport = require('passport')
const { routes, errorHandler } = require('../api')

const app = express()

app.use(express.json())
app.use(passport.initialize())

app.use((req, res, next) => {
  res.sendDocument = doc => {
    if (!doc) throw Error('No document given to sendDocument')

    return res.json(doc.toClient())
  }

  next()
})

app.use(routes())
app.use(errorHandler)

module.exports = app