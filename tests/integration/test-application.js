class TestClassA {
  constructor(testClassC) {
    this._testClassC = testClassC;
  }

  setTest(value) {
    this._testClassC.setValue(value);
  }
}

class TestClassB {
  constructor(testClassC, testClassD) {
    this._testClassC = testClassC;
    this._testClassD = testClassD;
  }

  getTestUpperCase() {
    const value = this._testClassC.getValue();
    return this._testClassD.uppercase(value);
  }
}

class TestClassC {
  constructor() {
    this._value = null;
  }

  setValue(value) {
    this._value = value;
  }

  getValue() {
    return this._value;
  }
}

class TestClassD {
  uppercase(string) {
    return string.toUpperCase();
  }
}

module.exports = {
  TestClassA,
  TestClassB,
  TestClassC,
  TestClassD
};
