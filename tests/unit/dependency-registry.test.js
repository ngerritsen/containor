import test from 'ava';
import sinon from 'sinon';

import DependenyRegistry from '../../lib/dependency-registry';
import Dependency from '../../lib/dependency';
import { DependencyAlreadyExistsError, DependencyNotFoundError } from '../../lib/errors';

test.beforeEach((t) => {
  t.context.dependenyRegistry = new DependenyRegistry();
  t.context.fakeDependency = sinon.createStubInstance(Dependency);
  sinon.stub(t.context.fakeDependency, 'name', { get: () => 'TestClass' });
});

test('Registering an existing dependency throws an DependencyAlreadyExistsError', (t) => {
  const { dependenyRegistry, fakeDependency } = t.context;

  dependenyRegistry.register(fakeDependency);

  t.throws(() => dependenyRegistry.register(fakeDependency), DependencyAlreadyExistsError);
});

test('Registering a dependency registers the dependency', (t) => {
  const { dependenyRegistry, fakeDependency } = t.context;

  dependenyRegistry.register(fakeDependency);

  const result = dependenyRegistry.get('TestClass');
  t.is(result, fakeDependency);
});

test('Getting a non existing dependency throws an DependencyNotFoundError', (t) => {
  const { dependenyRegistry, fakeDependency } = t.context;

  dependenyRegistry.register(fakeDependency);

  t.throws(() => dependenyRegistry.get('NonExistingClass'), DependencyNotFoundError);
});
