import test from 'ava';
import Dependency from '../../src//dependency';

class TestClass {}

test.beforeEach((t) => {
  t.context.dependency = new Dependency('TestClass', TestClass);
});

test('Regular dependency returns new instance every time', (t) => {
  const { dependency } = t.context;

  t.not(dependency.getInstance(), dependency.getInstance());
});

test('Shared dependency returns the same instance every time', (t) => {
  const dependency = new Dependency('TestClass', TestClass, true);

  t.is(dependency.getInstance(), dependency.getInstance());
});

test('Add arguments adds arguments', (t) => {
  const { dependency } = t.context;

  dependency.addArguments(['Arg1', 'Arg2']);

  t.deepEqual(dependency.arguments, [{ value: 'Arg1', raw: false }, { value: 'Arg2', raw: false }]);
});
