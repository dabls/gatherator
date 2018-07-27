const objectPath = require('object-path')

const xmlToJson = require('./xml')

module.exports = {
  stringToJson: () => (data) => typeof data === 'string' ? JSON.parse(data) : data,
  setRootPath: (path) => (data) => path ? objectPath.get(data, path) : data,
  xmlToJson
}
