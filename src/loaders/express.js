const express = require('express')
const routes = require('../api')

const app = express()

app.use(express.json());
app.use(routes())

app.use((req, res, next) => {
  res.sendDocument = doc => {
    return res.json(doc.toClient());
  }
})

module.exports = app