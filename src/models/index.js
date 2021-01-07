const Schema = require('mongoose').Schema
const { customAlphabet, urlAlphabet } = require('nanoid')

const generateId = customAlphabet(urlAlphabet, 10)

const EXPAND_LIMIT = 10 // populate limit on arrays

const ExpandableSchema = function(name, def = {}, virtuals = {}, options) {
  const schema = new Schema({
    _id: {
      type: String,
      default: generateId
    },
    ...def
  }, options)

  // add virtual props to schema
  Object.keys(virtuals).forEach(prop => {
    schema.virtual(prop, virtuals[prop])
  })

  addExpand(name, schema)
  addClientFormatter(name, schema, def, virtuals)

  return schema
}

// gets populateable real and virtual props
const getExpandableProps = schema => {
  const expandableArrays = []
  const expandableDocs = []

  Object.values(schema.paths).forEach(path => {
    if (path.options.ref) {
      if (path instanceof Schema.Types.String) return expandableDocs.push(path.path)
    }

    if (path instanceof Schema.Types.Array) {
      if (path.options.type[0].ref) return expandableArrays.push(path.path)
    }
  })

  Object.values(schema.virtuals).forEach(path => {
    if (path.options.ref) {
      expandableArrays.push(path.path)
    }
  })

  return {expandableArrays, expandableDocs}
}

const getSubDocProps = schema => {
  const {expandableArrays, expandableDocs} = getExpandableProps(schema)

  const subDocArrays = [...expandableArrays]
  const subDocs = [...expandableDocs]

  Object.values(schema.paths).forEach(path => {
    if (path instanceof Schema.Types.Embedded) subDocs.push(path.path)
    if (path instanceof Schema.Types.DocumentArray) subDocArrays.push(path.path)
  })

  return {subDocArrays, subDocs}
}

const addExpand = (name, schema) => {
  const {expandableArrays, expandableDocs} = getExpandableProps(schema)

  schema.method('expand', async function(props) {
    let query = this
  
    // TODO: protect against duplicate props
  
    props.forEach(prop => {
      const isDoc = expandableDocs.includes(prop)
      const isArray = expandableArrays.includes(prop)
  
      if (!isDoc && !isArray) throw new Error(`Unable to expand property ${prop} in ${name}.`) // TODO: throw error catchable by API route to throw a 400
      
      if (isArray) {
        query.populate({path: prop, options: {limit: EXPAND_LIMIT}})
      } else {
        query = query.populate(prop)
      }
    })
  
    const result = await query.execPopulate()
  
    props.forEach(prop => {
      if (expandableArrays.includes(prop)) {
        result.$locals[prop] = {hasMore: result[prop].length >= EXPAND_LIMIT} // TODO: invalid way of checking if more docs exist
      }
    })
  
    return result
  })
}

const addClientFormatter = (name, schema, def, virtuals) => {
  const clientProps = Object.keys(def).concat(Object.keys(virtuals)) // props to return in client response
  const {subDocs, subDocArrays} = getSubDocProps(schema)

  schema.method('toClient', function() {
    let obj = this.toObject()
  
    const id = obj._id
    const object = name

    const newObj = clientProps.reduce((newObj, prop) => {
      if (virtuals[prop]) {
        return Object.assign(newObj, {[prop]: this.get(prop)})
      } else {
        return Object.assign(newObj, {[prop]: obj[prop]})
      }
    }, {id, object})

    subDocArrays.forEach(prop => {
      if (!this[prop]) return

      if (this.populated(prop)) {
        const list = new List(this[prop], this.$locals[prop].hasMore)
        newObj[prop] = list.toClient()
      } else {
        newObj[prop] = this[prop].map(doc => doc.toClient ? doc.toClient() : doc)
      }
    })

    subDocs.forEach(prop => {
      if (!this[prop] || !this[prop].toClient) return

      newObj[prop] = this[prop].toClient()
    })
  
    if (this.$locals.deleted) {
      newObj.deleted = true
    }

    return newObj
  })
}

const List = function(data, hasMore) {
  this.data = data
  this.hasMore = hasMore
}

List.prototype.toClient = function() {
  let data = this.data.map(doc => doc.toClient())

  return {
    object: 'list',
    hasMore: this.hasMore,
    data
  }
}

module.exports = { ExpandableSchema, generateId, List }