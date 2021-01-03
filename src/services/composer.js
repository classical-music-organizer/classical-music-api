const { Composer } = require('../models/composer')

const ComposerService = {
  // TODO: optional populate; adjustable works limit
  // TODO: sort populated works by some sort of relevance metric

  async findById(id, expand = ['works']) {
    let composer = await Composer.findById(id).exec()
    if (composer) composer = await composer.expand(expand)
    
    return composer
  },

  async create(obj, expand = ['works']) {
    // TODO: protect against creating a composer with identical name of another composer

    let composer = new Composer(obj)
    composer = await composer.save()
    composer = await composer.expand(expand)

    return composer
  },

  async update(id, obj, expand = ['works']) {
    let composer = await Composer.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()
    composer = await composer.expand(expand)

    return composer
  },

  async delete(id, expand = ['works']) {
    // TODO: forbid deleting a composer that has remaning works

    let composer = await Composer.findByIdAndDelete(id).exec()
    composer = await composer.expand(expand)

    if (composer) {
      composer.$locals.deleted = true // mark as deleted for client response

      // propagate deleted prop to subdocs
      if (composer.info) composer.info.$locals.deleted = true
    }

    return composer
  }
}

module.exports = ComposerService