const express = require('express')
const routes = require('../api')

const app = express()

app.use(express.json());

app.use((req, res, next) => {
  res.sendDocument = doc => {
    if (!doc) throw new Error('TODO: no document error')

    return res.json(doc.toClient());
  }

  next()
})

app.use(routes())

module.exports = app