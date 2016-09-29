import test from 'ava';
import sinon from 'sinon';

import Containor from '../../src/containor';
import DependenyRegistry from '../../src/dependency-registry';
import DependencyResolver from '../../src/dependency-resolver';
import PublicDependencyProxy from '../../src/public-dependency-proxy';

class TestClass {}
const FIRST = 0;

test.beforeEach(t => {
  t.context.dependenyRegistryStub = sinon.createStubInstance(DependenyRegistry);
  t.context.dependenyResolverStub = sinon.createStubInstance(DependencyResolver);
  t.context.containor = new Containor(
    t.context.dependenyRegistryStub,
    t.context.dependenyResolverStub
  );
});

test('Adding constructs dependency and adds it to the registry', t => {
  const { containor, dependenyRegistryStub } = t.context;

  const result = containor.add(TestClass);

  t.is(dependenyRegistryStub.register.firstCall.args[FIRST].dependencyConstructor, TestClass);
  t.true(result instanceof PublicDependencyProxy);
});

test('Sharing constructs dependency and adds it to the registry', t => {
  const { containor, dependenyRegistryStub } = t.context;

  const result = containor.share(TestClass);

  t.is(dependenyRegistryStub.register.firstCall.args[FIRST].dependencyConstructor, TestClass);
  t.true(result instanceof PublicDependencyProxy);
});

test('Getting with constructor gets dependency instance with the name', t => {
  const { containor, dependenyResolverStub } = t.context;
  const stubInstance = sinon.createStubInstance(TestClass);

  dependenyResolverStub.resolve.withArgs(TestClass).returns(stubInstance);

  t.is(containor.get(TestClass), stubInstance);
});
