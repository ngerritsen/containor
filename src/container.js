import { validateArguments, invariant } from './utils'

/**
 * @typedef   {Object}    Container
 * @property  {Function}  add
 * @property  {Function}  get
 */

/**
 * @return {Container}
 */
export default function createContainer() {
  let dependencies = []

  function add(name, func, args = []) {
    validateArguments([name, func, args], 'add', {
      name: ['string', true],
      constructor: ['function', true],
      dependencies: ['array']
    })
    invariant(!findDependency(name), `Dependency '${name}' already exists.`)

    const dependency = { name, func, args }

    dependencies = [...dependencies, dependency]
  }

  function get(name) {
    validateArguments([name], 'get', { name: ['string', true] })
    invariant(findDependency(name), `Dependency '${name}' does not exist.`)

    const dependency = findDependency(name)
    const args = dependency.args.map(get)

    return invoke(dependency, args)
  }

  function findDependency(name) {
    return dependencies.find(dep => dep.name === name)
  }

  return { add, get }
}

function invoke({ func }, args) {
  return func.hasOwnProperty('prototype') ?
    new func(...args) : // eslint-disable-line new-cap
    func(...args)
}
