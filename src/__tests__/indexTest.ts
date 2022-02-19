import { createContainer, Container, raw, token } from "../index";

let container: Container;

const tokens = {
  foo: token<string>("foo"),
  bar: token<string>("bar"),
  qux: token<string>("qux"),
  biz: token<string>("biz"),
  baz: token<any[]>("baz"),
  dep: token<Dep>("dep"),
  counter: token<Counter>("counter"),
};

function baz(...args: any[]): any[] {
  return args;
}

class Dep {
  public args: any[];

  constructor(...args: any[]) {
    this.args = args;
  }
}

class Counter {
  private count = 0;

  public inc(): number {
    return (this.count += 1);
  }
}

beforeEach(() => {
  container = createContainer();
});

describe("Resolving dependencies", () => {
  test("Get a dependency.", () => {
    container.add(tokens.foo, () => "foo");

    expect(container.get(tokens.foo)).toBe("foo");
  });

  test("Get a dependency with dependencies.", () => {
    container.add(tokens.foo, () => "foo");
    container.add(tokens.bar, () => "bar");
    container.add(tokens.baz, baz, [tokens.foo, tokens.bar]);

    expect(container.get(tokens.baz)).toEqual(["foo", "bar"]);
  });

  test("Get a dependency with nested dependencies.", () => {
    container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]);
    container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]);
    container.add(tokens.qux, () => "qux");

    expect(container.get(tokens.foo)).toBe("foobarqux");
  });

  test("Get a class dependency with nested dependencies.", () => {
    container.add(tokens.foo, () => "foo");
    container.add(tokens.dep, Dep, [tokens.foo]);

    expect(container.get(tokens.dep).args).toEqual(["foo"]);
  });

  test("Manually resolve a dependency.", () => {
    container.add(tokens.foo, () => "foo");
    container.add(tokens.baz, () => {
      return baz(container.get(tokens.foo), "test");
    });

    expect(container.get(tokens.baz)).toEqual(["foo", "test"]);
  });
});

describe("Async dependency", () => {
  test("Async get waits for a dependency to be registered.", (done) => {
    container.get(tokens.foo, (foo: string) => {
      expect(foo).toBe("foo");
      done();
    });

    container.add(tokens.foo, () => "foo");
  });

  test("Async get works with registered sub dependencies.", (done) => {
    container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]);
    container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]);
    container.add(tokens.qux, () => "qux");

    container.get(tokens.foo, (foo: string) => {
      expect(foo).toBe("foobarqux");
      done();
    });
  });

  test("Async get waits for all sub dependencies.", (done) => {
    container.get(tokens.foo, (foo: string) => {
      expect(foo).toBe("foobarqux");
      done();
    });

    container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]);
    container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]);
    container.add(tokens.qux, () => "qux");
  });

  test("Async get waits for all sub dependencies delayed in different orders.", (done) => {
    container.get(tokens.foo, (foo: string) => {
      expect(foo).toBe("foobarqux");
      done();
    });

    setTimeout(
      () =>
        container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]),
      9
    );
    setTimeout(
      () =>
        container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]),
      3
    );
    setTimeout(() => container.add(tokens.qux, () => "qux"), 6);
  });

  test("Async get get only resolves once.", (done) => {
    container.get(tokens.foo, (str: string) => {
      expect(str).toBe("foo");
      done();
    });

    container.add(tokens.foo, () => "foo");
    container.add(tokens.bar, () => "bar");
  });

  test("Async immediately resolves when the dependency is already there.", () => {
    const callback = jest.fn();

    container.add(tokens.foo, () => "foo");
    container.get(tokens.foo, callback);

    expect(callback).toHaveBeenCalled();
  });
});

describe("Providers", () => {
  test("Provider is ran when a dependency it provides is required.", () => {
    container.provide([tokens.foo, tokens.bar], () => {
      container.add(tokens.foo, () => "foo");
    });

    container.get(tokens.foo, (str: string) => {
      expect(str).toBe("foo");
    });
  });

  test("Provide works sync when the dependency is provided sync.", () => {
    container.provide([tokens.foo, tokens.bar], () => {
      container.add(tokens.foo, () => "foo");
    });

    const foo = container.get(tokens.foo);

    expect(foo).toBe("foo");
  });
});

describe("Raw arguments", () => {
  test("Using raw adds a raw argument", () => {
    container.add(tokens.foo, (val: string) => "foo" + val, [raw("bar")]);

    expect(container.get(tokens.foo)).toBe("foobar");
  });
});

describe("Singletons", () => {
  test("Share adds a singleton dependency.", () => {
    container.share(tokens.counter, Counter);

    expect(container.get(tokens.counter).inc()).toBe(1);
    expect(container.get(tokens.counter).inc()).toBe(2);
  });
});

describe("Runtime errors", () => {
  test("Add throws when the dependency already exists.", () => {
    container.add(tokens.foo, () => "");

    expect(() => container.add(tokens.foo, () => "")).toThrowError(
      'Dependency "foo" already exists.'
    );
  });

  test("Share throws when the dependency already exists.", () => {
    container.add(tokens.foo, () => "");

    expect(() => container.share(tokens.foo, () => "")).toThrowError(
      'Dependency "foo" already exists.'
    );
  });

  test("Get throws when the dependency does not exist.", () => {
    expect(() => container.get(tokens.foo)).toThrowError(
      'Dependency "foo" does not exist.'
    );
  });

  test("Provide throws when one of the provided dependencies exist.", () => {
    container.add(tokens.foo, () => "");

    expect(() => container.provide([tokens.foo], () => {})).toThrowError(
      'Trying to provide dependency "foo" which already exists.'
    );
  });

  test("Provide throws when one of the provided dependencies is already provided.", () => {
    container.provide([tokens.foo], () => {});

    expect(() => container.provide([tokens.foo], () => {})).toThrowError(
      'Trying to provide dependency "foo" which is already provided.'
    );
  });
});

describe("Invalid argument errors", () => {
  type UntypedContainer = {
    add: Function;
    get: Function;
    share: Function;
    provide: Function;
  };

  let container: UntypedContainer;

  beforeEach(() => {
    container = createContainer() as UntypedContainer;
  });

  test("Add throws when the token argument is invalid.", () => {
    expect(() => container.add(123)).toThrowError(
      'First argument of "add" should be of type: "Token", received: "number".'
    );
  });

  test("Add throws when the creator argument is invalid.", () => {
    expect(() => container.add(tokens.foo, "dep")).toThrowError(
      'Second argument of "add" should be of type: "function", received: "string".'
    );
  });

  test("Add throws when the arguments argument is invalid.", () => {
    expect(() => container.add(tokens.foo, () => "", {})).toThrowError(
      'Third argument of "add" should be of type: "array", received: "object".'
    );
  });

  test("Share throws when the token argument is invalid.", () => {
    expect(() => container.share(null)).toThrowError(
      'First argument of "share" should be of type: "Token", received: "object".'
    );
  });

  test("Share throws when the creator argument is invalid.", () => {
    expect(() => container.share(tokens.foo, 123)).toThrowError(
      'Second argument of "share" should be of type: "function", received: "number".'
    );
  });

  test("Share throws when the arguments argument is invalid.", () => {
    expect(() => container.share(tokens.foo, () => "", true)).toThrowError(
      'Third argument of "share" should be of type: "array", received: "boolean".'
    );
  });

  test("Get throws when the token argument is invalid.", () => {
    expect(() => container.get(123)).toThrowError(
      'First argument of "get" should be of type: "Token", received: "number".'
    );
  });

  test("Provide throws when the tokens argument is invalid.", () => {
    expect(() => container.provide(["foo"])).toThrowError(
      "Trying to provide non token argument."
    );
  });
});
