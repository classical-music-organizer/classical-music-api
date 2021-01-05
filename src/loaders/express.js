const express = require('express')
const bearerToken = require('express-bearer-token')
const { routes, errorHandler } = require('../api')

const app = express()

app.use(express.json())
app.use(bearerToken())

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