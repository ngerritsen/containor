import test from 'ava';
import sinon from 'sinon';

import Dependency from '../../lib/dependency';
import DependencyRegistry from '../../lib/dependency-registry';
import DependenyResolver from '../../lib/dependency-resolver';

class TestClass {}
class TestClassA {}
class TestClassB {}
class TestClassC {}
class TestClassD {}

const stubInstanceA = sinon.createStubInstance(TestClassA);
const stubInstanceB = sinon.createStubInstance(TestClassB);
const stubInstanceC = sinon.createStubInstance(TestClassC);
const stubInstanceD = sinon.createStubInstance(TestClassD);

test.beforeEach((t) => {
  t.context.dependencyRegistryStub = sinon.createStubInstance(DependencyRegistry);
  t.context.dependencyResolver = new DependenyResolver(t.context.dependencyRegistryStub);
});

test('DependenyResolver can resolve dependencies without arguments', (t) => {
  const { dependencyRegistryStub, dependencyResolver } = t.context;
  const stubInstance = sinon.createStubInstance(TestClass);
  const dependencyStub = sinon.createStubInstance(Dependency);

  dependencyStub.arguments = [];
  dependencyStub.getInstance.returns(stubInstance);
  dependencyRegistryStub.get.withArgs('TestClass').returns(dependencyStub);

  const result = dependencyResolver.resolve(TestClass);

  t.is(result, stubInstance);
});

test.only('DependenyResolver can resolve dependencies with arguments', (t) => {
  const { dependencyRegistryStub, dependencyResolver } = t.context;

  const dependencyStubA = createDependencyStub([TestClassB, TestClassC]);
  const dependencyStubB = createDependencyStub();
  const dependencyStubC = createDependencyStub();

  dependencyStubA.getInstance.withArgs([stubInstanceB, stubInstanceC]).returns(stubInstanceA);
  dependencyStubB.getInstance.returns(stubInstanceB);
  dependencyStubC.getInstance.returns(stubInstanceC);

  dependencyRegistryStub.get.withArgs('TestClassA').returns(dependencyStubA);
  dependencyRegistryStub.get.withArgs('TestClassB').returns(dependencyStubB);
  dependencyRegistryStub.get.withArgs('TestClassC').returns(dependencyStubC);

  const result = dependencyResolver.resolve(TestClassA);

  t.is(result, stubInstanceA);
});

test.only('DependenyResolver can resolve dependencies with interface arguments', (t) => {
  const { dependencyRegistryStub, dependencyResolver } = t.context;

  const dependencyStubA = createDependencyStub(['TestClassBInterface']);
  const dependencyStubB = createDependencyStub();

  dependencyStubA.getInstance.withArgs([stubInstanceB]).returns(stubInstanceA);
  dependencyStubB.getInstance.returns(stubInstanceB);

  dependencyRegistryStub.get.withArgs('TestClassA').returns(dependencyStubA);
  dependencyRegistryStub.get.withArgs('TestClassBInterface').returns(dependencyStubB);

  const result = dependencyResolver.resolve(TestClassA);

  t.is(result, stubInstanceA);
});

test.only('DependenyResolver can resolve nested dependencies with arguments', (t) => {
  const { dependencyRegistryStub, dependencyResolver } = t.context;

  const dependencyStubA = createDependencyStub([TestClassB, TestClassC]);
  const dependencyStubB = createDependencyStub();
  const dependencyStubC = createDependencyStub([TestClassD]);
  const dependencyStubD = createDependencyStub();

  dependencyStubA.getInstance.withArgs([stubInstanceB, stubInstanceC]).returns(stubInstanceA);
  dependencyStubB.getInstance.returns(stubInstanceB);
  dependencyStubC.getInstance.withArgs([stubInstanceD]).returns(stubInstanceC);
  dependencyStubD.getInstance.returns(stubInstanceD);

  dependencyRegistryStub.get.withArgs('TestClassA').returns(dependencyStubA);
  dependencyRegistryStub.get.withArgs('TestClassB').returns(dependencyStubB);
  dependencyRegistryStub.get.withArgs('TestClassC').returns(dependencyStubC);
  dependencyRegistryStub.get.withArgs('TestClassD').returns(dependencyStubD);

  const result = dependencyResolver.resolve(TestClassA);

  t.is(result, stubInstanceA);
});

function createDependencyStub(args = []) {
  const dependencyStub = sinon.createStubInstance(Dependency);
  dependencyStub.arguments = args;
  return dependencyStub;
}
