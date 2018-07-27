const Promise = require('bluebird')

/**
 * Returns a function, which takes an iterator as parameter and
 * executes each given transformer on it.
 *
 * @params ...fns {array[function]} a collected list of transformer
 * @returns {function(iterator)}
 */
// const pipe = (...fns) => (iterator) => fns.length === 0 ? iterator : fns.reduce((iterable, fn) => fn(iterable), iterator)
const pipe = (...fns) => async (iterator) => fns.length === 0 ? iterator : Promise.reduce(fns, async (iterable, fn) => fn(iterable), iterator)

/**
 * Returns a list which just includes the collected functions.
 *
 * @params fns {array[*]} a collected list of anything
 * @returns array[function]
 */
const filterInFunction = (fns) => (Array.isArray(fns) ? fns : [fns]).filter((fn) => typeof fn === 'function')

module.exports = {
  pipe,
  filterInFunction
}
