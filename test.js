const test = require('ava')
const { createContainer, raw } = require('./src/container')

function dep(...args) {
  return args
}

class Dep {
  constructor(...args) {
    this.args = args
  }
}

function qux() {
  let count = 0
  return { inc: () => count += 1 } // eslint-disable-line no-return-assign
}

test.beforeEach(t => {
  const container = createContainer()

  container.add('foo', () => 'foo')
  container.add('bar', () => 'bar')

  t.context.container = container
})

test('Get a dependency.', t => {
  t.is(t.context.container.get('foo'), 'foo')
})

test('Get a dependency with dependencies.', t => {
  const container = t.context.container

  container.add('dep', dep, ['foo', 'bar'])

  t.deepEqual(container.get('dep'), ['foo', 'bar'])
})

test('Get a dependency with nested dependencies.', t => {
  const container = t.context.container

  container.add('depA', dep, ['foo'])
  container.add('depB', dep, ['depA', 'bar'])

  t.deepEqual(container.get('depB'), [['foo'], 'bar'])
})

test('Get a class dependency with nested dependencies.', t => {
  const container = t.context.container

  container.add('dep', Dep, ['foo'])

  t.deepEqual(container.get('dep').args, ['foo'])
})

test('Manually resolve a dependency.', t => {
  const container = t.context.container

  container.add('dep', () => {
    return dep(container.get('foo'), 'test')
  })

  t.deepEqual(container.get('dep'), ['foo', 'test'])
})

test('Lazy waits for a dependency to be registered.', t => {
  const container = t.context.container

  t.plan(1)

  container.lazy('baz', baz => {
    t.is(baz, 'baz')
  })

  container.add('baz', () => 'baz')
})

test('Lazy only resolves once.', t => {
  const container = t.context.container

  t.plan(1)

  container.lazy('baz', baz => {
    t.is(baz, 'baz')
  })

  container.add('baz', () => 'baz')
  container.add('other', () => 'other')
})

test('Lazy immediately resolves when the dependency is already there.', t => {
  const container = t.context.container

  t.plan(1)

  container.add('baz', () => 'baz')

  container.lazy('baz', baz => {
    t.is(baz, 'baz')
  })
})

test('Using raw adds a raw argument', t => {
  const container = t.context.container

  container.add('baz', val => val, [raw(1)])

  t.is(container.get('baz'), 1)
})

test('Share adds a singleton dependency.', t => {
  const container = t.context.container

  container.share('qux', qux)

  t.is(container.get('qux').inc(), 1)
  t.is(container.get('qux').inc(), 2)
})

test('Add throws when the dependency already exists.', t => {
  t.throws(
    () => t.context.container.add('foo', dep),
    'Dependency \'foo\' already exists.'
  )
})

test('Share throws when the dependency already exists.', t => {
  t.throws(
    () => t.context.container.share('foo', dep),
    'Dependency \'foo\' already exists.'
  )
})

test('Add throws when the name argument is invalid.', t => {
  t.throws(
    () => t.context.container.add(123),
    'First argument of add should be the name of type \'string\', got \'number\'.'
  )
})

test('Add throws when the dependency argument is invalid.', t => {
  t.throws(
    () => t.context.container.add('dep', 'dep'),
    'Second argument of add should be the constructor of type \'function\', got \'string\'.'
  )
})

test('Add throws when the arguments argument is invalid.', t => {
  t.throws(
    () => t.context.container.add('dep', dep, {}),
    'Third argument of add should be the arguments of type \'array\', got \'object\'.'
  )
})

test('Share throws when the name argument is invalid.', t => {
  t.throws(
    () => t.context.container.share(null),
    'First argument of share should be the name of type \'string\', got \'object\'.'
  )
})

test('Share throws when the dependency argument is invalid.', t => {
  t.throws(
    () => t.context.container.share('dep', 123),
    'Second argument of share should be the constructor of type \'function\', got \'number\'.'
  )
})

test('Share throws when the arguments argument is invalid.', t => {
  t.throws(
    () => t.context.container.share('dep', dep, true),
    'Third argument of share should be the arguments of type \'array\', got \'boolean\'.'
  )
})

test('Get throws when the name argument is invalid.', t => {
  t.throws(
    () => t.context.container.get(123),
    'First argument of get should be the name of type \'string\', got \'number\'.'
  )
})

test('Get throws when the dependency does not exist.', t => {
  t.throws(
    () => t.context.container.get('baz'),
    'Dependency \'baz\' does not exist.'
  )
})
