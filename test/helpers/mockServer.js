const nock = require('nock')

const response = require('../mock/data.json')
const baseUrl = 'https://mock.server'

function createMockServer ({ url = baseUrl, path = '/' } = {}) {
  nock(url).get(path).reply(200, response, { 'Content-Type': 'application/json' })

  return nock
}

module.exports = {
  createMockServer,
  baseUrl
}
