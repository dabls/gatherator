const retriever = require('./lib/retriever')
const parser = require('./lib/parser')
const transformer = require('./lib/transformer')
const createGenerator = require('./lib/generator')

module.exports = {
  createGenerator,
  retriever,
  parser,
  transformer
}
