const { List } = require('../models')
const { Performance } = require('../models/performance')

const PerformanceService = {

  // TODO: filter by performer or work
  async list({limit, skip} = {}) {
    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const options = {limit, skip}

    let performances = await Performance.find({}, null, options).exec()
    let hasMore
    
    if (performance.length < limit) {
      hasMore = false
    } else {
      const remainingCount = await Performance.estimatedDocumentCount({skip})
      hasMore = remainingCount > limit
    }

    const list = new List(performances, hasMore, '/') // TODO: use real url

    return list
  },

  async findById(id, expand = ['performers']) {
    let performance = await Performance.findById(id).exec()
    if (performance) performance = await performance.expand(expand)
    
    return performance
  },

  async create(obj, expand = ['performers']) {
    // TODO: protect against creating a performance with identical source to another

    let performance = new Performance(obj)
    performance = await performance.save()
    performance = await performance.expand(expand)

    return performance
  },

  async update(id, obj, expand = ['performers']) {
    let performance = await Performance.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()
    performance = await performance.expand(expand)

    return performance
  },

  async delete(id, expand = ['performers']) {
    let performance = await Performance.findByIdAndDelete(id).exec()
    performance = await performance.expand(expand)

    if (performance) {
      performance.$locals.deleted = true // mark as deleted for client response

      // propagate deleted prop to subdocs
      if (performance.info) performance.info.$locals.deleted = true
    }

    return performance
  }
}

module.exports = PerformanceService