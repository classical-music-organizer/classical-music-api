const mongoose = require('mongoose')
const { Schema } = mongoose
const { InfoSchema } = require('./info')
const { generateId, List } = require('./')

const ComposerSchema = new Schema({
  _id: {
    type: String,
    default: generateId
  },
  name: {
    title: String,
    first: {type: String, required: true},
    last: {type: String, required: true},
    middle: String,
    suffix: String,
    nick: String
  },
  info: InfoSchema,
  catalog: String
})

ComposerSchema.virtual('works', {
  ref: 'work',
  localField: '_id',
  foreignField: 'composer',
});

// TODO: only supports first-level expansions; should support nested expansion
// TODO: cleanup expand algorithm
const EXPANDABLE_DOCS = []
const EXPANDABLE_ARRAYS = ['works']
const POPULATE_LIMIT = 10

ComposerSchema.method('expand', async function(props) {
  let query = this

  // TODO: protect against duplicate props

  props.forEach(prop => {
    const isDoc = EXPANDABLE_DOCS.includes(prop)
    const isArray = EXPANDABLE_ARRAYS.includes(prop)

    if (!isDoc && !isArray) throw new Error(`Unable to expand property ${prop} in composer.`) // TODO: throw error catchable by API route to throw a 400
    
    if (isArray) {
      query.populate({path: prop, options: {limit: POPULATE_LIMIT}})
    } else {
      query = query.populate(prop)
    }
  })

  let result = await query.execPopulate()

  props.forEach(prop => {
    if (EXPANDABLE_ARRAYS.includes(prop)) {
      result.$locals[prop] = {hasMore: result[prop].length >= POPULATE_LIMIT}
    }
  })

  return result
})

// TODO: generalize using EXPANDABLE_PROPS
ComposerSchema.method('toClient', function() {
  let obj = this.toObject()

  const id = obj._id
  const object = 'composer'

  if (obj.info) obj.info = this.info.toClient()
  if (this.works) {
    const data = this.works.map(w => w.toClient())
    const list = new List(data, this.$locals.works.hasMore, '/') // TODO: use real url

    obj.works = list.toClient()
  }

  const prune = ({name, info, catalog, works}) => ({id, object, name, info, catalog, works})
  obj = prune(obj)

  if (this.$locals.deleted) {
    obj.deleted = true
  }

  return obj
})

const Composer = mongoose.model('composer', ComposerSchema)

module.exports = {Composer, ComposerSchema}