const { Composer } = require('../models/composer')

const ComposerService = {
  async findById(id) {
    const composer = await Composer.findById(id).exec()

    return composer
  },

  async create(obj) {
    // TODO: protect against creating a composer with identical name of another composer

    const composer = new Composer(obj)

    return await composer.save()
  },

  async update(id, obj) {
    const composer = await Composer.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()

    return composer
  },

  async delete(id) {
    const composer = await Composer.findByIdAndDelete(id).exec()
    if (composer) composer.$locals.deleted = true // mark as deleted for client response

    return composer
  }
}

module.exports = ComposerService