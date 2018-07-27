/**
 * Takes the iterator of the inner function and creates a new one,
 * which modifies the value by passing them to the given mapper function.
 *
 * @param fn {function(*)} the mapper function
 * @returns {function(iterator): iterator}
 */
const map = (fn) => async function * (iterator) {
  for await (const value of iterator) {
    yield await fn(value)
  }
}

/**
 * Takes the iterator of the inner function and creates a new one,
 * which filters out values by the result of the given filter function.
 *
 * @param fn {function(*): boolean} the filter function
 * @returns {function(iterator): iterator}
 */
const filter = (fn) => async function * (iterator) {
  for await (const value of iterator) {
    if (await fn(value)) {
      yield value
    }
  }
}

/**
 * Takes the iterator of the inner function and creates a new one,
 * which modifies the value by passing them to the given transformer function.
 *
 * If the modified value is `undefined` if will be filtered out of the iterator.
 *
 * @param fn {function(*)} the transformer function
 * @returns {function(iterator): iterator}
 */
const transform = (fn) => async function * (iterator) {
  for await (const value of iterator) {
    const transformed = await fn(value)

    if (transformed !== undefined) {
      yield transformed
    }
  }
}

module.exports = {
  map,
  filter,
  transform
}
