# Guide

## Tokens

Dependencies are registered using tokens, these can be typed to provide proper typehinting. Tokens have a name which needs to be unique when registered at the container. It is advised to organize these in central place(s) in your reposity.

```ts
const tokens = {
  token<Foo>("foo"),
  token<string>("bar"),
  token("baz")
};
```

## Singletons

Some dependencies you want to use the same instance of everywhere (for instance one that stores state):

```ts
class Counter() {
  private count: number = 0;

  public increment() {
    this.count++;
    return count;
  }
}

const tokens = {
  counter: token<Counter>("counter")
};

container.share(tokens.counter, counter);

container.get(tokens.counter).increment(); // returns '1'
container.get(tokens.counter).increment(); // returns '2' because it's the same instance 👍
```

## Constants

The container can also register constants, this is idea for third party libraries or configurations.

```ts
import _ from "lodash";

const tokens = {
  lodash: token<Lodash>("lodash"),
  environment: token<string>("environment")
};

container.constant(tokens.lodash, _);
container.constant(tokens.environment, "development");
```

## Async dependencies

By calling `getAsync`, it waits for the dependency (and all of it's sub-dependencies, this can be nested) to be registered, then resolves. If the dependency is already there, it will resolve immediately.

```ts
class Foo {}

const tokens = {
  foo: token<Foo>("foo"),
};

container.getAsync(tokens.foo).then((foo: Foo) => {
  // Runs as soon as foo is added to the container.
});

setTimeout(() => {
  container.add(tokens.foo, Foo);
}, 1000);
```

_Getting dependencies async is especially handy for client side code, where scripts can load asynchronously._

## Raw arguments

When you simply want to pass a raw value to a dependency without registering it as a constant, you can do this using a `raw` dependency:

```ts
import { raw } from "containor";

const tokens = {
  logger: token<Console>("logger"),
  displayMessage: token<void>("displayMessage"),
};

function displayMessage(logger: Console, message: string) {
  logger.log(message);
}

container.add(tokens.logger, () => console);
container.add(tokens.displayMessage, displayMessage, [
  tokens.logger,
  raw("Hello world!"),
]);

container.get(tokens.displayMessage); // Logs "Hello world!"
```

By adding an argument using `raw(value)`, it will just pass the value to the dependency instead of trying to resolve it with the container.

## Custom construction

Sometimes you need to do some logic when constructing a dependency. As any function can be a dependency, a simple arrow function works fine.

```ts
const tokens = {
  foo: token<Foo>("foo"),
  baz: token<Baz>("baz"),
};

container.add(tokens.baz, () => {
  const foo = container.get(tokens.foo);
  return new Baz(foo, config);
});

const baz = container.get(tokens.baz); // Your manually constructed version of Baz 😎
```

## Providers

Providers allow for lazily adding dependecies to the container. They can especially be useful to optimize performance and bundle size.

```ts
const tokens = {
  foo: token<Foo>("foo"),
  baz: token<Baz>("baz"),
};

container.provide([tokens.foo]).then(() => {
  /* ... Load dependencies async somehow */ (foo) => {
    container.add(tokens.foo, foo);
  };
});

container.getAsync(tokens.foo).then((foo: Foo) => {
  // Foo will be instantiated async as soon as it is provided
});
```

When calling `container.provide`, you tell the container: _"As soon as you need these dependencies, I will add them to the container"_. This way you save work if you never need the dependecy at all, or later in the application's life cycle.

> ⚠️ Be careful with using a synchronous `container.get` in combination with `container.provide`. Only do this when you are sure the dependency has already been provided. `container.provide` works best when used in tandem with `container.getAsync`.
