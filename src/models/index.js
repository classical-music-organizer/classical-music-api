const { ajv } = require('../loaders')

const getExpandableProps = schema => Object.keys(schema.properties).filter(prop => schema.properties[prop].expandable)

const Models = {}

// TODO: add autoexpand props, mongodb table name (default to name)
const ModelFactory = function(name, schema) {
  if (Models[name]) throw new Error(`Model '${name}' is already registered.`);

  const validator = ajv.compile(schema) // validates the schema
  const expandable = getExpandableProps(schema)

  const model = {[name]: function(obj) {
    Object.assign(this, obj);
  }}[name];

  model.prototype.response = function() {
    return Object.assign({}, this, {object: name})
  }

  // TODO: props is a list of strings that can represent nested props
  model.prototype.expand = function(props) {
    // TODO: validate that the props are valid
    // TODO: expand the object
  }

  model.findById = id => {
    // TODO: find object by Id
    return new model({})
  }

  model.findByIds = ids => {
    // TODO: return objects by ids
    return new model({})
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