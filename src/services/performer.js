const { List } = require('../models')
const { Performer } = require('../models/performer')

const PerformerService = {

  // TODO: filter by performance
  async list({limit, skip, search} = {}) {
    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const filter = {}
    const proj = {}
    const options = {limit, skip}

    if (search && search != '') {
      filter.$text = {$search: search}
      proj.score = {$meta: 'textScore'}
    }

    let performers = await Performer.find(filter, proj, options).exec()
    let hasMore
    
    if (performers.length < limit) {
      hasMore = false
    } else {
      const remainingCount = await Performer.estimatedDocumentCount({skip}) // TODO: count broken for searching
      hasMore = remainingCount > limit
    }

    const list = new List(performers, hasMore)

    return list
  },

  async findById(id, expand = ['performances']) {
    let performer = await Performer.findById(id).exec()
    if (performer) performer = await performer.expand(expand)
    
    return performer
  },

  async create(obj, expand = ['performances']) {
    // TODO: protect against creating a performer with identical name of another performer

    let performer = new Performer(obj)
    performer = await performer.save()
    performer = await performer.expand(expand)

    return performer
  },

  async update(id, obj, expand = ['performances']) {
    let performer = await Performer.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()
    performer = await performer.expand(expand)

    return performer
  },

  async delete(id, expand = ['performances']) {
    let performer = await Performer.findByIdAndDelete(id).exec()
    performer = await performer.expand(expand)

    if (performer) {
      performer.$locals.deleted = true // mark as deleted for client response

      // propagate deleted prop to subdocs
      if (performer.info) performer.info.$locals.deleted = true
    }

    return performer
  }
}

module.exports = PerformerService