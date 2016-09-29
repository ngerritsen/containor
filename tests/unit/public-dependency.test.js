import test from 'ava';
import sinon from 'sinon';

import PublicDependencyProxy from '../../src/public-dependency-proxy';
import Dependency from '../../src/dependency';

class TestArgClass1 {}
class TestArgClass2 {}

test('With sets arguments on dependency', t => {
  const dependencyStub = sinon.createStubInstance(Dependency);
  const publicDependencyProxy = new PublicDependencyProxy(dependencyStub);

  publicDependencyProxy.with(TestArgClass1, TestArgClass2);

  t.deepEqual(dependencyStub.addArguments.firstCall.args[0], [TestArgClass1, TestArgClass2]);
});

test('Raw sets raw arguments on dependency', t => {
  const dependencyStub = sinon.createStubInstance(Dependency);
  const publicDependencyProxy = new PublicDependencyProxy(dependencyStub);

  publicDependencyProxy.raw('Arg1', 'Arg2');

  t.deepEqual(dependencyStub.addArguments.firstCall.args[0], ['Arg1', 'Arg2']);
  t.is(dependencyStub.addArguments.firstCall.args[1], true);
});
