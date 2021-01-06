const slugify = require('slugify')
const { List } = require('../models')
const { Tag } = require('../models/tag')

const TagService = {
  async list({limit, skip} = {}) {
    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const options = {limit, skip}

    let tags = await Tag.find({}, null, options).exec()
    let hasMore
    
    if (tags.length < limit) {
      hasMore = false
    } else {
      const remainingCount = await Tag.estimatedDocumentCount({skip})
      hasMore = remainingCount > limit
    }

    const list = new List(tags, hasMore)

    return list
  },

  async findById(id) {
    return await Tag.findById(id).exec()
  },

  async create(obj) {
    // TODO: protect against creating identical tag

    const tag = new Tag(obj)
    tag.slug = slugify(tag.name)

    return await tag.save()
  },

  async update(id, obj) {
    obj.slug = slugify(obj.name)
    const tag = await Tag.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()

    return tag
  },

  async delete(id) {
    // TODO: forbid deleting a tag that has remaning works

    const tag = await Tag.findByIdAndDelete(id).exec()

    if (tag) tag.$locals.deleted = true // mark as deleted for client response

    return tag
  }
}

module.exports = TagService