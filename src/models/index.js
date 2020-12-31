const List = require('./list')
const { ajv } = require('../loaders')

// returns array of expandable schema property names
// TODO: this is random and probably shouldn't be here
const getExpandableProps = schema => Object.keys(schema.properties).filter(prop => schema.properties[prop].expandable)

const Models = {}
const Model = function() {} // used as marker class

// TODO: add autoexpand props, mongodb table name (default to name)
const ModelFactory = function(name, schema) {
  if (Models[name]) throw new Error(`Model '${name}' is already registered.`);

  const validator = ajv.compile(schema) // validates the schema

  const model = {[name]: function(obj) {
    Object.assign(this, obj);
  }}[name];

  // mark as Model
  model.prototype = new Model(name)
  Object.defineProperty(model.prototype, 'constructor', {
    value: model,
    enumerable: false,
    writable: true
  });

  model.prototype.response = function() {
    let res = Object.assign({}, this, {object: name})

    Object.keys(res).forEach(prop => {
      if (res[prop] instanceof Model || res[prop] instanceof List) {
        res[prop] = res[prop].response()
      }
    })

    return res
  }

  model.prototype.expand = function(props) {
    if (typeof props == 'string') props = [props] // accepts a single string

    // create a dict with the first part of the prop path to be key and the remaining part to be the value
    // if props is the array ['works.catalog', 'works.composer', 'other'], 
    // then propExpansions becomes {'works': ['catalog', 'composer'], 'other': []}
    const propExpansions = props.reduce((dict, cur) => {
      let prop = cur.split('.')[0] // first part of nested path
      let remaining = cur.split('.').slice(1).join('.') // remaining nested path
      remaining = remaining == '' ? null : remaining

      if (!expandable.includes(prop)) throw new Error(`Property '${prop}' is not expandable in ` + name)

      dict[prop] = dict[prop] ? dict[prop] : []
      if (!remaining) return dict

      if (dict[prop] && !dict[prop].includes(remaining)) {
        dict[prop] = dict[prop].concat(remaining)
      }

      return dict;
    }, {})

    Object.keys(propExpansions).forEach(prop => {
      const {object, type} = schema.properties[prop]
      const model = Models[object] // TODO: replace with getModel function

      if (!model) throw new Error(`Model '${object}' has not been registered.`)
      if (this[prop] instanceof Model || this[prop] instanceof List) throw new Error(`Property '${prop}' has already been expanded.`)

      let obj;

      if (type == 'string') {
        if (typeof this[prop] != 'string') throw new Error(`Property '${prop}' is not valid against the schema.`)

        obj = model.findById(this[prop])
        obj.expand(propExpansions[prop])
      } else if (type == 'array') {
        if (!Array.isArray(this[prop])) throw new Error(`Property '${prop}' is not valid against the schema.`)

        let data = model.findByIds(this[prop])
        data.forEach(o => o.expand(propExpansions[prop]))

        obj = new List(model, data)
      }

      this[prop] = obj;
    })

    return this
  }

  const expandable = getExpandableProps(schema)
  model.isExpandable = prop => expandable.includes(prop)

  model.findById = id => {
    // TODO: find object by Id
    return new model({id})
  }

  model.findByIds = ids => {
    // TODO: return objects by ids
    return ids.map(id => new model({id}))
  }

  // TODO: decide whether this should validate against the schema
  model.create = obj => {

  }

  model.update = obj => {

  }

  model.delete = id => {

  }

  // register model in order to expand properties of other models
  Models[name] = model;

  return model;
}

const InfoSchema = {
  type: 'string'
}

module.exports = {
  ModelFactory,
  InfoSchema
};