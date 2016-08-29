import test from 'ava';
import sinon from 'sinon';

import PublicDependencyProxy from '../../lib/public-dependency-proxy';
import Dependency from '../../lib/dependency';

test('With arguments sets arguments on dependency', (t) => {
  const dependencyStub = sinon.createStubInstance(Dependency);
  const publicDependencyProxy = new PublicDependencyProxy(dependencyStub);

  publicDependencyProxy.with('Arg1', 'Arg2');

  t.deepEqual(dependencyStub.arguments, ['Arg1', 'Arg2']);
});
