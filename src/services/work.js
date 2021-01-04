const { List } = require('../models')
const { Work } = require('../models/work')

const WorkService = {
  async list({composer, limit, skip} = {}) {
    // TODO: validate composer ID?

    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const options = {limit, skip}
    const filter = composer ? {composer} : {}

    let works = await Work.find(filter, null, options).exec()
    let hasMore
    
    if (works.length < limit) {
      hasMore = false
    } else {
      // estimatedDocumentCount can be used when no filter (no composer) is used
      if (Object.keys(filter) == 0) {
        const remainingCount = await Work.estimatedDocumentCount({skip}).exec()
        hasMore = remainingCount > limit
      } else {
        const totalCount = await Work.countDocuments(filter).exec()
        hasMore = totalCount - skip > limit
      }
    }

    const list = new List(works, hasMore, '/') // TODO: use real url

    return list
  },

  async findById(id, expand = ['composer']) {
    let work = await Work.findById(id).exec()
    if (work) work = await work.expand(expand)
    
    return work
  },

  async create(obj, expand = ['composer']) {
    // TODO: protect against creating a work with identical name of another work

    let work = new Work(obj)
    work = await work.save()
    work = await work.expand(expand)

    return work
  },

  async update(id, obj, expand = ['composer']) {
    let work = await Work.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()
    if (work) work = await work.expand(expand)

    return work
  },

  async delete(id, expand = ['composer']) {
    let work = await Work.findByIdAndDelete(id).populate('composer').exec()
    if (work) work = await work.expand(expand)

    if (work) {
      work.$locals.deleted = true // mark as deleted for client response

      // mark subdocs as deleted
      if (work.movements) work.movements.forEach(m => m.$locals.deleted = true)
      if (work.info) work.info.$locals.deleted = true
    }

    return work
  }
}

module.exports = WorkService