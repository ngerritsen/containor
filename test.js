import test from 'ava'
import createContainer from './src/container'

function dep(...args) {
  return args
}

class OoDep {
  constructor(...args) {
    this.args = args
  }
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

  container.add('dep', OoDep, ['foo'])

  t.deepEqual(container.get('dep').args, ['foo'])
})

test('Manually resolve a dependency.', t => {
  const container = t.context.container

  container.add('dep', () => {
    return dep(container.get('foo'), 'test')
  })

  t.deepEqual(container.get('dep'), ['foo', 'test'])
})

test('Add throws when the dependency already exists.', t => {
  t.throws(
    () => t.context.container.add('foo', dep),
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

test('Add throws when the dependencies argument is invalid.', t => {
  t.throws(
    () => t.context.container.add('dep', dep, {}),
    'Third argument of add should be the dependencies of type \'array\', got \'object\'.'
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
