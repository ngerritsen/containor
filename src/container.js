const { validateArguments, invariant } = require('./utils')

/**
 * @typedef {Object}  RawArgument
 * @property {*}      value
 */

/**
 * @typedef   {Object}    Container
 * @property  {Function}  add
 * @property  {Function}  share
 * @property  {Function}  get
 */

const RAW = {}

/**
 * @return {Container}
 */
function createContainer() { // eslint-disable-line max-statements
  let dependencies = []
  let subscribers = []

  /**
   * Registers a depedency at the container.
   *
   * @param {string}    name                          Dependency name
   * @param {Function}  func                          Constructor or factory function
   * @param {Array.<(string|RawArgument)>} [args=[]]  Dependency arguments to inject
   */
  function add(name, func, args = []) {
    validateRegistrationArguments(name, func, args, 'add')
    const dependency = { name, func, args }
    dependencies = [...dependencies, dependency]
    subscribers.forEach(subscriber => subscriber())
  }

  /**
   * Registers a singleton depedency at the container.
   *
   * @param {string}    name      Dependency name
   * @param {Function}  func      Constructor or factory function
   * @param {Array}     [args=[]] Dependency arguments to inject
   */
  function share(name, func, args = []) {
    validateRegistrationArguments(name, func, args, 'share')
    const dependency = { name, func, args, shared: true }
    dependencies = [...dependencies, dependency]
    subscribers.forEach(subscriber => subscriber())
  }

  /**
   * Get an instantiated, injected dependency from the container.
   *
   * @param {string}  name  Dependency name
   * @return {*}  Resolved dependency
   */
  function get(name) {
    validateArguments([name], 'get', { name: ['string', true] })
    const dependency = findDependency(name)
    invariant(dependency, `Dependency '${name}' does not exist.`)
    return instantiate(dependency)
  }

  /**
   * Wait for the dependency to be added to the container.
   *
   * @param {string}    name  Dependency name
   * @param {Function}  cb    Callback to call when registered
   */
  function lazy(name, cb) {
    const subscriber = () => {
      const dependency = findDependency(name)

      if (dependency) {
        subscribers = subscribers.filter(s => s !== subscriber)
        return cb(instantiate(dependency))
      }
    }

    subscribers = [...subscribers, subscriber]

    subscriber()
  }

  function instantiate({ name, func, instance, args, shared }) {
    if (shared) {
      return instance || createSingle(name, func, instance, args)
    }

    return create(func, args)
  }

  function create(func, args) {
    const resolvedArgs = args.map(resolve)
    return func.hasOwnProperty('prototype') ?
      new func(...resolvedArgs) : // eslint-disable-line new-cap
      func(...resolvedArgs)
  }

  function createSingle(name, func, instance, args) {
    const newInstance = create(func, args)
    dependencies = setInstance(name, newInstance)
    return newInstance
  }

  function findDependency(name) {
    return dependencies.find(dep => dep.name === name)
  }

  function setInstance(name, instance) {
    return dependencies.map(dep =>
      name === dep.name ?
        Object.assign({}, dep, { instance }) :
        dep
    )
  }

  function resolve(arg) {
    return isRawArg(arg) ? arg.value : get(arg)
  }

  function isRawArg(arg) {
    // eslint-disable-next-line no-underscore-dangle
    return arg && typeof arg === 'object' && arg._raw === RAW
  }

  function validateRegistrationArguments(name, func, args, type) {
    validateArguments([name, func, args], type, {
      name: ['string', true],
      constructor: ['function', true],
      arguments: ['array']
    })
    invariant(!findDependency(name), `Dependency '${name}' already exists.`)
  }

  return { add, share, get, lazy }
}

/**
 * @param {*} value
 *
 * @returns {RawArgument}
 */
function raw(value) {
  return { _raw: RAW, value }
}

module.exports = { createContainer, raw }
