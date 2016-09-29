import test from 'ava';
import Dependency from '../../src//dependency';

class TestClass {}
class TestArgClass1 {}
class TestArgClass2 {}

test.beforeEach(t => {
  t.context.dependency = new Dependency(TestClass);
});

test('Regular dependency returns new instance every time', t => {
  const { dependency } = t.context;

  t.not(dependency.getInstance(), dependency.getInstance());
});

test('Shared dependency returns the same instance every time', t => {
  const dependency = new Dependency(TestClass, true);

  t.is(dependency.getInstance(), dependency.getInstance());
});

test('Add arguments adds arguments', t => {
  const { dependency } = t.context;

  dependency.addArguments([TestArgClass1, TestArgClass2]);

  t.deepEqual(dependency.arguments, [{ value: TestArgClass1, raw: false }, { value: TestArgClass2, raw: false }]);
});

test('Add arguments with raw true adds raw arguments', t => {
  const { dependency } = t.context;

  dependency.addArguments(['A', 'B'], true);

  t.deepEqual(dependency.arguments, [{ value: 'A', raw: true }, { value: 'B', raw: true }]);
});

test('Adding arguments multiple times will add up the arguments', t => {
  const { dependency } = t.context;

  dependency.addArguments(['A', 'B'], true);
  dependency.addArguments(['C'], true);

  t.deepEqual(dependency.arguments, [{ value: 'A', raw: true }, { value: 'B', raw: true }, { value: 'C', raw: true }]);
});
