# Getting started

## Installation

Containor can be installed by using any package manager using the npm repository.

```bash
npm install containor
```

With yarn:

```bash
yarn add containor
```

> Containor ships with Typescript types included, these do not have to be installed separately.

## Basic usage

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
  bar: token<Bar>("bar")
}

const container = createContainer();

container.add(tokens.foo, Foo, [tokens.bar]);
container.add(tokens.bar, Bar);

const foo = container.get(tokens.foo); // An instance of Foo with Bar injected.
```

## Including as script tag

Containor is not hosted on any cdn yet, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. When included, containor put on the global window object as `Containor`.

```js
const container = Containor.createContainer();
const rawArgument = Containor.raw(123);
```
