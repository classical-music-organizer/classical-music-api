const MongoClient = require('mongodb').MongoClient
const config = require('../config')

let client
let db
let dbListeners = []

module.exports = {
  connect() {
    MongoClient.connect(config.dbUrl, function(err, c) {
      if (err) throw err;
  
      client = c
      db = client.db(config.dbName)
      dbListeners.forEach(res => res(db))
    })
  },

  async getDb() {
    if (db) return db

    // the db is still connecting, so let the connect function resolve the db when finished connecting
    return new Promise(res => dbListeners.push(res))
  },


  close() {
    if (client) client.close()
  }
}