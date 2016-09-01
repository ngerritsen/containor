import test from 'ava';
import DependencyFactory from '../../src/dependency-factory';

class TestClass {}

test.beforeEach((t) => {
  t.context.dependencyFactory = new DependencyFactory();
});

test('Creating dependency with constructor as matchingElement uses constructor name for dependency name', (t) => {
  const { dependencyFactory } = t.context;

  const result = dependencyFactory.create(TestClass);

  t.is(result.name, 'TestClass');
});

test('Creating dependency with interface as matchingElement uses interface for dependency name', (t) => {
  const { dependencyFactory } = t.context;

  const result = dependencyFactory.create('TestClassInterface', TestClass);

  t.is(result.name, 'TestClassInterface');
});
