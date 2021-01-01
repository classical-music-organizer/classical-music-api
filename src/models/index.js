const { customAlphabet, urlAlphabet } = require('nanoid')

const generateId = customAlphabet(urlAlphabet, 10)

module.exports = { generateId }