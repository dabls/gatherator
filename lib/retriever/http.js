const request = require('request-promise')

module.exports = (defaults = {}) => async (options = {}) => request({ ...defaults, ...options })
