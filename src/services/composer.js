const { Composer } = require('../models/composer')

const ComposerService = {
  async findById(id) {
    const composer = await Composer.findById(id).exec()

    return composer
  },

  async create(obj) {
    const composer = new Composer(obj)

    return await composer.save()
  },

  async update(id, obj) {
    const composer = await Composer.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()

    return composer
  },

  async delete(id) {
    const composer = await Composer.findByIdAndDelete(id).exec()
    composer.$locals.deleted = true

    return composer
  }
}

module.exports = ComposerService