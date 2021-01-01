const express = require('express')
const { routes, errorHandler } = require('../api')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.sendDocument = doc => {
    if (!doc) throw new Error('TODO: no document error')

    return res.json(doc.toClient());
  }

  next()
})

app.use(routes())
app.use(errorHandler)

module.exports = app