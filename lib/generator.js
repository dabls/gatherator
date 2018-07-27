const deepEqual = require('deep-equal')

const { pipe, filterInFunction } = require('./helper')

module.exports = async ({ retriever, getRetrieverOptions, uri, transformers = [], parsers = [], ...options } = {}) => {
  if (typeof retriever !== 'function') {
    throw new Error('A retriever function have to be provided when defining a generator')
  }

  parsers = filterInFunction(parsers)
  transformers = filterInFunction(transformers)

  getRetrieverOptions = typeof getRetrieverOptions === 'function' ? getRetrieverOptions : (opts) => opts
  uri = typeof uri === 'function' ? uri() : uri

  const generator = async function * () {
    while (true) {
      try {
        const preparedOptions = getRetrieverOptions({ uri, ...options })
        if (deepEqual(preparedOptions, options)) {
          break
        }

        options = preparedOptions
        const data = await pipe(...parsers)(retriever(options))

        if (!Array.isArray(data)) {
          yield data
          break
        } else {
          if (data.length === 0) {
            break
          }

          for (const element of data) {
            yield element
          }
        }
      } catch ({ message }) {
        console.debug(message)
        break
      }
    }
  }

  return pipe(...transformers)(generator())
}
