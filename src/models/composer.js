const mongoose = require('mongoose')
const { Schema } = mongoose
const { InfoSchema } = require('./info')

const ComposerSchema = new Schema({
  name: {
      title: String,
      first: {type: String, required: true},
      last: {type: String, required: true},
      middle: String,
      suffix: String,
      nick: String
  },
  //catalog: {type: String, expandable: true, object: 'catalog'}, // id
  info: InfoSchema
});

ComposerSchema.method('toClient', function() {
  let obj = this.toObject();
  obj.id = obj._id

  const prune = ({id, name, info}) => ({id, name, info})

  obj = Object.assign(prune(obj), {object: 'composer'})

  return obj;
});

const Composer = mongoose.model('Composer', ComposerSchema)

module.exports = {Composer, ComposerSchema};