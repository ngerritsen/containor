import { createContainer, Container, raw, token, createModule } from "../index";

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
  test("Async get waits for a dependency to be registered.", () => {
    const promise = container.getAsync(tokens.foo).then((foo: string) => {
      expect(foo).toBe("foo");
    });

    container.add(tokens.foo, () => "foo");

    return promise;
  });

  test("Add async registers dependency async.", () => {
    const promise = container.getAsync(tokens.foo).then((foo: string) => {
      expect(foo).toBe("foo");
    });

    container.addAsync(
      tokens.foo,
      Promise.resolve(() => "foo")
    );

    return promise;
  });

  test("Add async reserves dependency while being resolved.", () => {
    const promise = container.addAsync(
      tokens.foo,
      Promise.resolve(() => "foo")
    );

    expect(() => {
      container.add(tokens.foo, () => "foo");
    }).toThrowError(`Dependency "foo" has already been reserved.`);

    return promise;
  });

  test("Add async cancels reservation when rejected.", async () => {
    try {
      await container.addAsync(tokens.foo, Promise.reject(new Error()));
    } catch (e) {
      // Do nothing
    }

    expect(() => {
      container.add(tokens.foo, () => "foo");
    }).not.toThrow();
  });

  test("Share async registers dependency async.", () => {
    const promise = Promise.all([
      container.getAsync(tokens.counter).then((counter: Counter) => {
        expect(counter.inc()).toBe(1);
      }),
      container.getAsync(tokens.counter).then((counter: Counter) => {
        expect(counter.inc()).toBe(2);
      }),
    ]);

    container.shareAsync(tokens.counter, Promise.resolve(Counter));

    return promise;
  });

  test("Share async reserves dependency while being resolved.", () => {
    const promise = container.shareAsync(
      tokens.counter,
      Promise.resolve(Counter)
    );

    expect(() => {
      container.share(tokens.counter, Counter);
    }).toThrowError(`Dependency "counter" has already been reserved.`);

    return promise;
  });

  test("Share async cancels reservation when rejected.", async () => {
    try {
      await container.shareAsync(tokens.counter, Promise.reject(new Error()));
    } catch (e) {
      // Do nothing
    }

    expect(() => {
      container.share(tokens.counter, Counter);
    }).not.toThrow();
  });

  test("Contant async registers constant async.", () => {
    const promise = container.getAsync(tokens.foo).then((value) => {
      expect(value).toBe("foo");
    });

    container.constantAsync(tokens.foo, Promise.resolve("foo"));

    return promise;
  });

  test("Constant async reserves dependency while being resolved.", () => {
    const promise = container.constantAsync(tokens.foo, Promise.resolve("foo"));

    expect(() => {
      container.constant(tokens.foo, "foo");
    }).toThrowError(`Dependency "foo" has already been reserved.`);

    return promise;
  });

  test("Constant async cancels reservation when rejected.", async () => {
    try {
      await container.constantAsync(tokens.foo, Promise.reject(new Error()));
    } catch (e) {
      // Do nothing
    }

    expect(() => {
      container.constant(tokens.foo, "foo");
    }).not.toThrow();
  });

  test("Async get works with registered sub dependencies.", () => {
    container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]);
    container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]);
    container.add(tokens.qux, () => "qux");

    return container.getAsync(tokens.foo).then((foo: string) => {
      expect(foo).toBe("foobarqux");
    });
  });

  test("Async get waits for all sub dependencies.", () => {
    const promise = container.getAsync(tokens.foo).then((foo: string) => {
      expect(foo).toBe("foobarqux");
    });

    container.add(tokens.foo, (str: string) => "foo" + str, [tokens.bar]);
    container.add(tokens.bar, (str: string) => "bar" + str, [tokens.qux]);
    container.add(tokens.qux, () => "qux");

    return promise;
  });

  test("Async get waits for all sub dependencies delayed in different orders.", () => {
    const promise = container.getAsync(tokens.foo).then((foo: string) => {
      expect(foo).toBe("foobarqux");
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

    return promise;
  });
});

describe("Providers", () => {
  test("Provider is ran when a dependency it provides is required.", () => {
    container.provide([tokens.foo, tokens.bar], (c) => {
      c.add(tokens.foo, () => "foo");
    });

    return container.getAsync(tokens.foo).then((str: string) => {
      expect(str).toBe("foo");
    });
  });

  test("Provider is ran sync when a dependency it provides is required sync.", () => {
    container.provide([tokens.foo, tokens.bar], (c) => {
      c.add(tokens.foo, () => "foo");
    });

    const str = container.get(tokens.foo);

    expect(str).toBe("foo");
  });

  test("Async provider is ran when a dependency it provides is required.", () => {
    container.provideAsync(
      [tokens.foo, tokens.bar],
      Promise.resolve((c) => {
        c.add(tokens.foo, () => "foo");
      })
    );

    return container.getAsync(tokens.foo).then((str: string) => {
      expect(str).toBe("foo");
    });
  });
});

describe("Modules", () => {
  test("Module register is ran when a dependency it provides is required.", () => {
    container.use(
      createModule([tokens.foo, tokens.bar], (c) => {
        c.add(tokens.foo, () => "foo");
      })
    );

    return container.getAsync(tokens.foo).then((str: string) => {
      expect(str).toBe("foo");
    });
  });

  test("Module register is ran sync when a dependency it provides is required sync.", () => {
    container.use(
      createModule([tokens.foo, tokens.bar], (c) => {
        c.add(tokens.foo, () => "foo");
      })
    );

    const str = container.get(tokens.foo);

    expect(str).toBe("foo");
  });

  test("Async module register is ran when a dependency it provides is required.", () => {
    container.useAsync(
      Promise.resolve(
        createModule([tokens.foo, tokens.bar], (c) => {
          c.add(tokens.foo, () => "foo");
        })
      )
    );
    return container.getAsync(tokens.foo).then((str: string) => {
      expect(str).toBe("foo");
    });
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

describe("Constants", () => {
  test("Constant adds a constant", () => {
    container.constant(tokens.foo, "foo");

    expect(container.get(tokens.foo)).toBe("foo");
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
      'Dependency "foo" is already being provided.'
    );
  });
});

describe("Invalid argument errors", () => {
  type UntypedContainer = {
    add: Function;
    get: Function;
    getAsync: Function;
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

  test("GetAsync throws when the token argument is invalid.", () => {
    expect(() => container.getAsync(123)).toThrowError(
      'First argument of "getAsync" should be of type: "Token", received: "number".'
    );
  });

  test("Provide throws when the tokens argument is invalid.", () => {
    expect(() => container.provide(["foo"])).toThrowError(
      "Trying to provide non token argument."
    );
  });
});
