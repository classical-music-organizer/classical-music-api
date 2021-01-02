const { customAlphabet, urlAlphabet } = require('nanoid')

const generateId = customAlphabet(urlAlphabet, 10)

const List = function(data, hasMore, url) {
  this.data = data
  this.hasMore = hasMore
  this.url = url
}

List.prototype.toClient = function() {
  return {
    object: 'list',
    hasMore: this.hasMore,
    url: this.url,
    data: this.data
  }
}

module.exports = { generateId, List }