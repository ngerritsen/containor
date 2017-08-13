const { validateArguments, invariant, find, includes } = require('./utils')

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
  const dependencies = Object.create(null)
  const providers = Object.create(null)

  let subscribers = []

  /**
   * Registers a depedency at the container.
   *
   * @param {string}    name                          Dependency name
   * @param {Function}  func                          Constructor or factory function
   * @param {Array.<(string|RawArgument)>} [args=[]]  Dependency arguments to inject
   */
  function add(name, func, args = []) {
    register(name, func, args, 'add')
  }

  /**
   * Registers a singleton depedency at the container.
   *
   * @param {string}    name                          Dependency name
   * @param {Function}  func                          Constructor or factory function
   * @param {Array.<(string|RawArgument)>} [args=[]]  Dependency arguments to inject
   */
  function share(name, func, args = []) {
    register(name, func, args, 'share', true)
  }

  function register(name, func, args, method, shared = false) {
    validateRegistrationArguments(name, func, args, method)
    dependencies[name] = { func, args, shared }
    subscribers.forEach(s => s.subscriber(name))
  }

  /**
   * Get an instantiated, injected dependency from the container.
   *
   * @param {string}    name        Dependency name
   * @param {Function}  [callback]  Resolve dependency async
   *
   * @return {(*|void)}  Resolved dependency or nothing in case of a callback
   */
  function get(name, callback) {
    validateArguments([name, callback], 'get', {
      name: ['string', true],
      callback: ['function']
    })

    const provider = providers[name]

    if (!dependencies[name] && typeof provider === 'function') {
      provider()
    }

    if (callback) {
      return getAsync(name, callback)
    }

    invariant(dependencies[name], `Dependency "${name}" does not exist.`)

    return instantiate(name, dependencies[name])
  }

  /**
   * @param {Array.<string>}  names
   * @param {Function}        callback
   */
  function provide(names, callback) {
    validateProviderArguments(names, callback)

    if (find(subscribers, ({ name }) => includes(names, name))) {
      callback()
      return
    }

    const disposableProvider = () => {
      names.forEach(name => {
        providers[name] = true
      })

      callback()
    }

    names.forEach(name => {
      providers[name] = disposableProvider
    })
  }

  function subscribe(name, subscriber) {
    subscribers = [...subscribers, { on: name, subscriber }]
  }

  function unsubscribe(subscriber) {
    subscribers = subscribers.filter(s => s.subscriber !== subscriber)
  }

  function getAsync(name, cb) {
    if (dependencies[name]) {
      return cb(instantiate(name, dependencies[name]))
    }

    const subscriber = registeredName => {
      if (registeredName === name) {
        unsubscribe(subscriber)
        instantiateAsync(name, dependencies[name], cb)
      }
    }

    subscribe(name, subscriber)
  }

  function instantiate(name, { func, instance, args, shared }) {
    if (shared) {
      return instance || createSingle(name, func, instance, args)
    }

    return create(func, args)
  }

  function instantiateAsync(name, { func, instance, args, shared }, cb) {
    if (shared) {
      return cb(instance) || createSingleAsync(name, func, instance, args, cb)
    }

    return createAsync(func, args, cb)
  }

  function create(func, args) {
    return construct(func, resolve(args))
  }

  function createAsync(func, args, cb) {
    resolveAsync(args, resolvedArgs => cb(construct(func, resolvedArgs)))
  }

  function createSingle(name, func, instance, args) {
    const newInstance = create(func, args)
    setInstance(name, newInstance)
    return newInstance
  }

  function createSingleAsync(name, func, instance, args, cb) {
    createAsync(func, args, newInstance => {
      setInstance(name, newInstance)
      cb(newInstance)
    })
  }

  function construct(func, args) {
    return func.hasOwnProperty('prototype') ?
      new func(...args) : // eslint-disable-line new-cap
      func(...args)
  }

  function setInstance(name, instance) {
    dependencies[name].instance = instance
  }

  function resolve(args) {
    return args.map(arg => isRawArg(arg) ? arg.value : get(arg))
  }

  function resolveAsync(args, cb) {
    args.reduceRight((next, arg) => resolvedArgs => {
      return isRawArg(arg) ?
        next([...resolvedArgs, arg.value]) :
        get(arg, dependency => next([...resolvedArgs, dependency]))
    }, cb)([])
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
    invariant(!dependencies[name], `Dependency "${name}" already exists.`)
  }

  function validateProviderArguments(names, callback) {
    validateArguments([names, callback], 'provide', {
      names: ['array', true],
      callback: ['function']
    })

    names.forEach(name => {
      invariant(!dependencies[name], `Trying to provide dependency "${name}" which already exists.`)
      invariant(!providers[name], `Trying to provide dependency "${name}" which is already provided.`)
    })
  }

  return { add, share, get, provide }
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
