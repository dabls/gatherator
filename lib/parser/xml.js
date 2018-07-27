const Promise = require('bluebird')
const xml2js = require('xml2js')

Promise.promisifyAll(xml2js)

/**
 * Simply parse the income XML-String to a JSON object.
 *
 * @param options
 * @returns {function(data)}
 */
module.exports = (options = {}) => {
  const parser = new xml2js.Parser({
    normalizeTags: true,
    normalize: true,
    explicitArray: false,
    ...options
  })

  return async (data) =>
    Array.isArray(data) ? Promise.map(data, (chunk) => parser.parseStringAsync(chunk)) : parser.parseStringAsync(data)
}
