const List = function(model, data, hasMore = false, url='/') {
  const homogenous = data.every(v => v instanceof model)

  if (!homogenous) throw new Error('The members in the list are not all of the same model.')

  this.data = data
  this.hasMore = hasMore
  this.url = url // TODO: use strongly typed routes?
}

List.prototype.response = function() {
  let res = Object.assign({}, this, {object: 'list'})
  res.data = res.data.map(obj => obj.response())

  return res
}

module.exports = List