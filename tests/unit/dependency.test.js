import test from 'ava';
import Dependency from '../../lib//dependency';

class TestClass {}

test('Regular dependency returns new instance every time', (t) => {
  const dependency = new Dependency('TestClass', TestClass);

  t.not(dependency.getInstance(), dependency.getInstance());
});

test('Shared dependency returns the same instance every time', (t) => {
  const dependency = new Dependency('TestClass', TestClass, true);

  t.is(dependency.getInstance(), dependency.getInstance());
});
