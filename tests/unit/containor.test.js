import test from 'ava';
import sinon from 'sinon';

import Containor from '../../src/containor';
import DependenyRegistry from '../../src/dependency-registry';
import DependencyFactory from '../../src/dependency-factory';
import DependencyResolver from '../../src/dependency-resolver';
import Dependency from '../../src/dependency';
import PublicDependencyProxy from '../../src/public-dependency-proxy';

class TestClass {}
const FIRST = 0;

test.beforeEach((t) => {
  t.context.dependenyRegistryStub = sinon.createStubInstance(DependenyRegistry);
  t.context.dependencyFactoryStub = sinon.createStubInstance(DependencyFactory);
  t.context.dependenyResolverStub = sinon.createStubInstance(DependencyResolver);

  t.context.dependencyStub = sinon.createStubInstance(Dependency);
  t.context.containor = new Containor(
    t.context.dependenyRegistryStub,
    t.context.dependencyFactoryStub,
    t.context.dependenyResolverStub
  );
});

test('Adding constructs dependency with factory and adds it to the registry', (t) => {
  const { containor, dependenyRegistryStub, dependencyFactoryStub, dependencyStub } = t.context;

  dependencyFactoryStub.create.withArgs('TestClass', TestClass).returns(dependencyStub);

  const result = containor.add('TestClass', TestClass);

  t.is(dependenyRegistryStub.register.firstCall.args[FIRST], dependencyStub);
  t.true(result instanceof PublicDependencyProxy);
});

test('Sharing constructs dependency with factory and adds it to the registry', (t) => {
  const { containor, dependenyRegistryStub, dependencyFactoryStub, dependencyStub } = t.context;

  dependencyFactoryStub.create.withArgs('TestClass', TestClass, true).returns(dependencyStub);

  const result = containor.share('TestClass', TestClass);

  t.is(dependenyRegistryStub.register.firstCall.args[FIRST], dependencyStub);
  t.true(result instanceof PublicDependencyProxy);
});

test('Getting with constructor gets dependency instance with the name', (t) => {
  const { containor, dependenyResolverStub } = t.context;
  const stubInstance = sinon.createStubInstance(TestClass);

  dependenyResolverStub.resolve.withArgs(TestClass).returns(stubInstance);

  containor.add(TestClass);

  const result = containor.get(TestClass);

  t.is(result, stubInstance);
});

test('Getting with interface gets dependency instance with the interface name', (t) => {
  const { containor, dependenyResolverStub } = t.context;
  const stubInstance = sinon.createStubInstance(TestClass);

  dependenyResolverStub.resolve.withArgs('TestClassInterface').returns(stubInstance);

  containor.add('TestClassInterface', TestClass);

  const result = containor.get('TestClassInterface');

  t.is(result, stubInstance);
});
