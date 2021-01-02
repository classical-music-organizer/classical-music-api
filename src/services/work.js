const { Work } = require('../models/work')

const WorkService = {
  // TODO: optional population

  async findById(id) {
    const work = await Work.findById(id).populate('composer').exec()

    return work
  },

  async create(obj) {
    // TODO: protect against creating a work with identical name of another work

    let work = new Work(obj)
    work = await work.save()
    work = await work.populate('composer').execPopulate()

    return work
  },

  async update(id, obj) {
    const work = await Work.findByIdAndUpdate(id, {$set: obj}, {new: true}).populate('composer').exec()

    return work
  },

  async delete(id) {
    const work = await Work.findByIdAndDelete(id).populate('composer').exec()
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