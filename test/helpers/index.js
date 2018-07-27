const { expect } = require('chai')

/**
 * Creates a function that checks if a specified property of an object equals to a previously given value.
 *
 * Optionally, you can pass a string as the second parameter,
 * which will select the objetc's property to compare. (default: "message")
 *
 * @param expected
 * @param property
 * @returns {function(*=)}
 */
function expectEqual (expected, property = 'message') {
  return (object) => {
    expect(object[property]).to.equal(expected)
  }
}

/**
 * Creates a function that checks if an object is and instance of the previously given constructor.
 *
 * @param constructor
 * @returns {function(*=)}
 */
function expectInstanceOf (constructor) {
  return (object) => {
    expect(object).to.be.an.instanceof(constructor)
  }
}

/**
 * Helper function for expecting async functions to throw errors.
 *
 * Optionally, you can pass a function as the second parameter,
 * which will receive the error object as its sole parameter.
 *
 * @param fn
 * @param comparisonFn
 * @returns {Promise.<void>}
 */
async function expectAsyncError (fn, comparisonFn) {
  let error

  try {
    await fn()
  } catch (e) {
    error = e
  }

  if (!error) {
    throw new Error('Expected function to throw an error.')
  }

  if (typeof comparisonFn === 'function') {
    comparisonFn(error)
  }
}

module.exports = {
  expectEqual,
  expectInstanceOf,
  expectAsyncError
}
