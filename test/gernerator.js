/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */

const { expect } = require('chai')
const request = require('request-promise')

const { createMockServer, baseUrl } = require('./helpers/mockServer')
const { createGenerator, retriever: { createHttpRetriever, createFileRetriever }, parser: { xmlToJson, stringToJson, setRootPath }, transformer: { map, filter, transform } } = require('../index')
const { pipe } = require('../lib/helper')

const delay = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 50))
const delayed = (seconds) => async (value) => await delay(seconds) || value

const blubber = (value) => ({
  ...value,
  blub: `blub-${value.blub || value.id}`
})
const isEven = (value) => (value.id % 2 === 0)
const idToNumber = ({ id, ...other }) => ({
  id: Number(id),
  ...other
})

const mapId = map(idToNumber)
const mapBlubber = map(blubber)
const filterEven = filter(isEven)
const mapDelay = transform(delayed(1))

const execute = async (iterable) => {
  let response = []

  response.push(await iterable.next())
  response.push(await iterable.next())
  response.push(await iterable.next())

  for await (const variable of iterable) {
    response.push(variable)
  }

  return response
}

describe('generator', () => {
  let response1, response2, response3, response4

  it('fetch data from mock service, without generator creation', async function () {
    this.timeout(0)

    // possible way to create a simple async-generator - missing: while-true (paging), custom request, custom iterable-data
    const simpleGenerator = () => ({
      [Symbol.asyncIterator]: async function * () {
        createMockServer({ path: '/1' })
        createMockServer({ path: '/2' })
        createMockServer({ path: '/3' })

        let offset = 1

        while (true) {
          try {
            const { data } = await request.get(`${baseUrl}/${offset++}`, { json: true })
            if (!Array.isArray(data) || data.length === 0) {
              break
            }

            for (const entry of data) {
              yield entry
            }
          } catch (error) {
            console.debug(error.message)
            break
          }
        }
      }
    })

    const test1 = mapDelay(mapBlubber(filterEven(mapBlubber(mapBlubber(simpleGenerator())))))
    const test2 = await pipe(mapBlubber, mapBlubber, filterEven, mapBlubber, mapDelay)(simpleGenerator())

    response1 = await execute(test1)
    response2 = await execute(test2)

    // compare 2 different ways to combine map, filter and transformers
    expect(response1).to.deep.equal(response2)
  })

  it('fetch data from mock service, with created generator', async function () {
    this.timeout(0)

    const createTestGenerator = async (retriever, ...parsers) => {
      createMockServer({ path: '/1' })
      createMockServer({ path: '/2' })
      createMockServer({ path: '/3' })

      return createGenerator({
        retriever,
        getRetrieverOptions: ({ subPath }) => ({
          subPath: subPath + 1,
          uri: `${baseUrl}/${subPath}`
        }),
        subPath: 1,
        transformers: [mapBlubber, mapBlubber, filterEven, mapBlubber, mapDelay],
        parsers
      })
    }

    const jsonRetriever = createHttpRetriever({ json: true })
    const plainRetriever = createHttpRetriever({ json: false })

    const generator1 = await createTestGenerator(jsonRetriever, setRootPath('data'))
    const generator2 = await createTestGenerator(plainRetriever, stringToJson(), setRootPath('data'))

    response3 = await execute(generator1)
    response4 = await execute(generator2)

    // compare 2 different ways to parse the response
    expect(response3).to.deep.equal(response4)

    expect(response1).to.deep.equal(response3)
    expect(response2).to.deep.equal(response4)
  })

  it('fetch data from mock xml file, with created generator', async function () {
    this.timeout(0)

    const retriever = createFileRetriever()
    const generator = await createGenerator({
      retriever,
      uri: `${__dirname}/mock/data.xml`,
      transformers: [mapId, mapBlubber, mapBlubber, filterEven, mapBlubber, mapDelay],
      parsers: [xmlToJson(), setRootPath('data.entry')]
    })

    const response = await execute(generator)

    // compare xml file data with http json data
    expect(response).to.deep.equal(response1)
  })
})
