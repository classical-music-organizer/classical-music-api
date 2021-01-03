const { Work } = require('../models/work')

const WorkService = {
  // TODO: optional population

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