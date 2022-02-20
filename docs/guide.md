# Guide

Using Containor should be simple, let's go over the features.

## Basic usage

Create a token for each dependency, register the dependencies with the appropriate token and arguments, that's it!

```ts
import { createContainer, token } from "containor";

class Foo {
  constructor(bar: Bar) {
    this.bar = bar;
  }
}

class Bar {}

const tokens = {
  foo: token<Foo>("foo"),
  bar: token<Bar>("bar"),
};

const container = createContainer();

container.add(tokens.foo, Foo, [tokens.bar]);
container.add(tokens.bar, Bar);

const foo = container.get(tokens.foo); // An instance of Foo with Bar injected.
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
  environment: token<string>("environment"),
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

For registering asynchronous dependencies, each registration method has an async variant. These take a promise that resolves to the creator:

```ts
container.addAsync(tokens.foo, import("./Foo.ts"), [tokens.bar]);

container.shareAsync(tokens.counter, import("./Counter.ts"));

container.constantAsync(tokens.name, fetchName());
```

Especially with the asynchronous import syntax this can be convenient.

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
  bar: token<Bar>("bar"),
};

container.provide([tokens.foo], (c: Container) => {
  c.add(tokens.foo, Foo, [tokens.bar]);
  c.add(tokens.bar, Bar);
});

const foo = container.get(tokens.foo);
```

When calling `container.provide`, you tell the container: _"As soon as you need these dependencies, I will add them to the container"_. This way you save work if you never need the dependecy at all, or later in the application's life cycle. This also means that dependencies being added that are not listed will **not** trigger the provider:

```ts
container.provide([tokens.foo], (c: Container) => {
  c.add(tokens.foo, Foo, [tokens.bar]);
  c.add(tokens.bar, Bar);
});

const bar = container.get(tokens.bar); // This will not work, bar is an internal dependency and not exposed as being provided.
```

!> Be careful with using `container.get` in combination with `container.provide`. Only do this when you are sure the dependency has already been provided.

In the previous example everything was synchronous, what if the dependencies in our provider are asynchronous. This is perfectly possible, it works exactly the same as when adding dependencies asynchronously without a provider. Just make sure to use retieve the dependencies asynchronous aswell:

```ts
container.provide([tokens.foo], (c: Container) => {
  c.addAsync(tokens.foo, import("./foo.ts"));
});

const foo = await container.getAsync(tokens.foo);
```

```ts
container.provide([tokens.foo], import("./provider.ts"));

const foo = await container.getAsync(tokens.foo);
```

This can be helpful if the provider still needs to be downloaded or do some asynchronous work beforehand.

## Modules

Modules provide the same functionality as providers, but in a more modular way:

```ts
// tokens.ts
import { token } from "./containor";

export default {
  foo: token<Foo>("foo"),
  bar: token<Bar>("bar"),
};
```

```ts
// myModule/module.ts
import { createModule } from "./containor";
import tokens from "../tokens.ts";

const myModule = createModule([tokens.foo], (c: Container) => {
  c.add(tokens.foo, Foo, [tokens.bar]);
  c.add(tokens.bar, Bar);
});
```

```ts
// index.ts
import { createContainer } from "./containor";

const container = createContainer();

container.use(myModule);

const foo = container.get(tokens.foo);
```

This is a perfect way of splitting up your project. Asynchronous modules work very similar to asynchronous providers.

```ts
// index.ts
container.useAsync(import("./myModule/module.ts"));

const foo = await container.getAsync(tokens.foo);
```

From here on the same rules apply as providers. Containor also provides a `Module` inteface for an object oriented style:

```ts
// MyModule.ts
import { Module } from "containor";
import tokens from "./tokens";

export default class MyModule implements Module {
  public provides = [tokens.foo];

  public register(container: Container) {
    container.add(tokens.foo, Foo, [tokens.bar]);
    ccontainer.add(tokens.bar, Bar);
  }
}
```

```ts
// index.ts
import MyModule from "./MyModule.ts";

container.use(MyModule);

const foo = await container.getAsync(tokens.foo);
```
