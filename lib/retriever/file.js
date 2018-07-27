const fs = require('fs-extra')

module.exports = (defaults = {}) =>
  async ({ uri, ...options } = {}) => fs.readFile(uri, { encoding: 'utf8', ...defaults, ...options })
