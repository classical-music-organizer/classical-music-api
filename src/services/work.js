const slugify = require('slugify')
const { List } = require('../models')
const { Work } = require('../models/work')
const { Tag } = require('../models/tag')

const WorkService = {
  async list({composer, limit, skip, search} = {}) {
    // TODO: validate composer ID?

    const defaults = {limit: 10, skip: 0}
    if (!limit) limit = defaults.limit
    if (!skip) skip = defaults.skip

    const options = {limit, skip}
    const filter = {}
    const proj = {}

    if (composer) filter.composer = composer

    if (search && search != '') {
      filter.$text = {$search: search}
      proj.score = {$meta: 'textScore'}
    }

    let works

    if (search && search != '') {
      works = await Work.find(filter, proj, options).sort({score: {$meta: 'textScore'}}).exec()
    } else {
      works = await Work.find(filter, proj, options).exec()
    }
    
    let hasMore
    
    if (works.length < limit) {
      hasMore = false
    } else {
      // estimatedDocumentCount can be used when no filter (no composer or search) is used
      if (Object.keys(filter) == 0) {
        const remainingCount = await Work.estimatedDocumentCount({skip}).exec()
        hasMore = remainingCount > limit
      } else {
        const totalCount = await Work.countDocuments(filter).exec()
        hasMore = totalCount - skip > limit
      }
    }

    const list = new List(works, hasMore)

    return list
  },

  async findById(id, {expand, populateTagWorks} = {}) {
    if (!expand) expand = ['composer']

    let work = await Work.findById(id).exec()
    if (work) work = await work.expand(expand)

    if (populateTagWorks) {
      work.tags = await this.populateTagWorks(work.tags)
    }
    
    return work
  },

  async create(obj, expand = ['composer']) {
    // TODO: protect against creating a work with identical name of another work

    if (obj.tags) {
      // TODO: check that each tag listed exists; check that there are no duplicate tags
      obj.tags = await Tag.find({_id: {$in: obj.tags}}).exec()
    }

    let work = new Work(obj)
    work.slug = slugify(work.name)
    work = await work.save()
    work = await work.expand(expand)

    return work
  },

  async update(id, obj, expand = ['composer']) {
    if (obj.tags) {
      // TODO: check that each tag listed exists; check that there are no duplicate tags
      obj.tags = await Tag.find({_id: {$in: obj.tags}}).exec()
    }

    let work = await Work.findByIdAndUpdate(id, {$set: obj}, {new: true}).exec()
    if (work) {
      work.slug = slugify(work.name)
      work = await work.expand(expand)
    }

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
  },

  async populateTagWorks(tags) {
    if (!tags || tags.length == 0) return []

    const tagIds = tags.map(t => t._id)

    // TODO: limit query, sort query?
    // TODO: when WorkService.list can filter by tags, make a call to it instead
    const works = await Work.find({'tags._id': {$in: tagIds}}).exec()

    return tags.map(tag => {
      const tagWorks = works.filter(w => {
        return !!w.tags.find(t => t._id == tag._id)
      })
      
      // TODO: actually check if hasMore
      tag.works = new List(tagWorks, false)

      return tag
    })
  }
}

module.exports = WorkService