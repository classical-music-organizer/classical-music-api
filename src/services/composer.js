const { List } = require('../models')
const { Composer } = require('../models/composer')
const { Tag } = require('../models/tag')

const ComposerService = {
  // TODO: sort populated works by some sort of relevance metric

  async list({limit, skip, search} = {}) {
    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const options = {limit, skip}
    let composers

    if (!search || search == '') {
      composers = await Composer.find({}, null, options).exec()
    } else {
      composers = await Composer.find(
        {$text: {$search: search}},
        {score: {$meta: 'textScore'}}, options
      ).sort({score: {$meta: 'textScore'}}).exec()
    }
    
    let hasMore
    
    if (composers.length < limit) {
      hasMore = false
    } else {
      const remainingCount = await Composer.estimatedDocumentCount({skip}) // TODO: counting broken for searches
      hasMore = remainingCount > limit
    }

    const list = new List(composers, hasMore)

    return list
  },

  async findById(id, expand = ['works']) {
    let composer = await Composer.findById(id).exec()
    if (composer) composer = await composer.expand(expand)
    
    return composer
  },

  async create(obj, expand = ['works']) {
    // TODO: protect against creating a composer with identical name of another composer

    if (obj.tags) {
      // TODO: check that each tag listed exists; check that there are no duplicate tags
      obj.tags = await Tag.find({_id: {$in: obj.tags}}).exec()
    }

    let composer = new Composer(obj)
    composer = await composer.save()
    composer = await composer.expand(expand)

    return composer
  },

  async update(id, obj, expand = ['works']) {
    if (obj.tags) {
      // TODO: check that each tag listed exists; check that there are no duplicate tags
      obj.tags = await Tag.find({_id: {$in: obj.tags}}).exec()
    }

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