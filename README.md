[![Build Status](https://gitlab.com/ngerritsen/containor/badges/master/pipeline.svg)](https://gitlab.com/ngerritsen/containor/-/commits/master)

# 📦 Containor

Simple IOC/DI container for Javascript with Typescript support.

- Supports any programming style.
- Typescript support.
- Resolve dependecies async.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor weighs just ~3.6kb minified!\*_

## Guide

### Installation

```bash
npm install containor
```

### Basic usage

```ts
import { createContainer, token } from "containor";

class Foo {
  constructor() {
    this.message = "foo";
  }
}

class Bar(foo) {
  constructor(foo: Foo) {
    this.message = foo.message,
  };
}

const container = createContainer();

const tokens = {
  foo: token<Foo>("foo"),
  bar: token<Bar>("bar"),
}

// A dependency can be a function or a class, it will be invoked with 'new' if possible.
container.add(tokens.foo, Foo);
container.add(tokens.bar, Bar, [tokens.foo]);

const bar = container.get(tokens.bar); // An instance of bar with an instance of Foo as an argument
```

### Tokens

Dependencies are registered using tokens, these can be typed to provide proper typehinting. Tokens have a name which needs to be unique when registered at the container.

```ts
const tokens = {
  token<Foo>("foo"),
  token<string>("bar"),
  token("baz")
};
```

### Singletons

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

### Constants

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

### Async dependencies

By adding a callback to `get`, it waits for the dependency (and all of it's sub-dependencies, this can be nested) to be registered, then runs the callback. If the dependency is already there, it will resolve immediately.

```ts
const tokens = {
  foo: token<Foo>("foo"),
};

container.get(tokens.foo, (foo: Foo) => {
  // Runs as soon as foo is added to the container.
});

setTimeout(() => {
  container.add(tokens.foo, Foo);
}, 1000);
```

_Getting dependencies async is especially handy for client side code, where scripts can load asynchronously._

### Raw arguments

Sometimes you just want to pass a raw value to a dependency instead of just other dependencies, you can do this using `raw`:

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

### Custom construction

Sometimes you just want to do some inline logic when constructing a dependency. As any function can be a dependency, a simple arrow function works fine.

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

### Providers

Providers allow for lazily adding dependecies to the container. They can especially be useful to optimize performance and bundle size.

```ts
const tokens = {
  foo: token<Foo>("foo"),
  baz: token<Baz>("baz"),
};

container.provide([tokens.foo], () => {
  /* ... Load dependencies async somehow */ (foo) => {
    container.add(tokens.foo, foo);
  };
});

container.get(tokens.foo, (foo: Foo) => {
  // Foo will be instantiated async as soon as it is provided
});
```

When calling `container.provide`, you tell the container: _"As soon as you need these dependencies, I will add them to the container"_. This way you save work if you never need the dependecy at all, or later in the application's life cycle.

> Note that when calling `container.get` **without** a callback, it will fail if the provider is providing the dependencies async, as the dependencies will not be immediately available.

## Including as a script tag

Containor is not hosted on any cdn yet, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. When included, containor put on the global window object as `Containor`.

```js
const container = Containor.createContainer();
const rawArgument = Containor.raw(123);
```

## API

### `token<T>(name: string) => Token<T>`

### `createContainer() => Container`

Creates a new instance of containor.

### `.add<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a dependency to the container. Optionally define it's dependencies. Creator can be a constructor of type `T` or a function with return type `Y`.

### `.share<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a singleton dependency to the container. Optionally define it's dependencies. Creator can be a constructor of type `T` or a function with return type `Y`.

### `.constant<T>(token: Token<T>, value: T): void`

Add a constant value to the container. Value has to be of type `T`.

### `.get<T>(token: Token): T`

### `.get<T>(token: Token, callback: (T) => void): void`

Get a dependency from the container, when a callback is provided, will wait for all dependencies to be available.

### `.provide(tokens: Token[], callback: () => void): void`

Register as a provider of dependencies, will get notified via the callback when a dependency is requested.

_\* Size measured by bundling with rollup and typescript with terser. I will be even less when gzipped_
