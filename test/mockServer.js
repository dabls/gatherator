/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */

const { expect } = require('chai')
const request = require('request-promise')

const { createMockServer, baseUrl } = require('./helpers/mockServer')

const data = require('./mock/data.json')

const path = '/fetch-all'
const url = `${baseUrl}${path}`

describe('mock server', () => {
  before(() => {
    createMockServer({ path })
  })

  it('fetch all values', async () => {
    const response = await request.get(url, { json: true })
    expect(response).to.deep.equal(data)
  })
})
