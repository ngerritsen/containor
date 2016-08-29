import test from 'ava';
import Containor from '../../lib';

import { TestClassA, TestClassB, TestClassC, TestClassD } from './test-application';

test('Can add and get a dependency', (t) => {
  const containor = new Containor();

  containor.add(TestClassA);
  const testClassInstance = containor.get(TestClassA);

  t.is(testClassInstance.constructor, TestClassA);
});

test('Can share a dependency', (t) => {
  const containor = new Containor();

  containor.share(TestClassA);
  const testClassInstanceA = containor.get(TestClassA);
  const testClassInstanceB = containor.get(TestClassA);

  t.is(testClassInstanceB, testClassInstanceA);
});

test('Can use interface to add and get a dependency', (t) => {
  const containor = new Containor();

  containor.add('TestClassAInterface', TestClassA);
  const testClassInstance = containor.get('TestClassAInterface');

  t.is(testClassInstance.constructor, TestClassA);
});

test('Can add and get multiple dependant dependencies', (t) => {
  const containor = new Containor();

  containor.add(TestClassA).with('TestClassCInterface');
  containor.add(TestClassB).with('TestClassCInterface', TestClassD);
  containor.add(TestClassD);
  containor.share('TestClassCInterface', TestClassC);

  const testClassInstanceA = containor.get(TestClassA);
  const testClassInstanceB = containor.get(TestClassB);

  testClassInstanceA.setTest('TestValue');
  const result = testClassInstanceB.getTestUpperCase();

  t.is(result, 'TESTVALUE');
});
