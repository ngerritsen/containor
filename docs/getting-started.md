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
  bar: token<Bar>("bar"),
};

const container = createContainer();

container.add(tokens.foo, Foo, [tokens.bar]);
container.add(tokens.bar, Bar);

const foo = container.get(tokens.foo); // An instance of Foo with Bar injected.
```

### Including as script tag

Containor can be included via a script tag and accessed via the `Containor` global variable:

```html
<script src="https://cdn.jsdelivr.net/npm/containor/dist/containor.min.js"></script>

<script>
  const container = Containor.createContainer();
  const rawArgument = Containor.raw(123);
  const token = Containor.token("myToken");
</script>
```

An unminified version is available for development:

```html
<script src="https://cdn.jsdelivr.net/npm/containor/dist/containor.js"></script>
```

You can also get a specific version:

```html
<script src="https://cdn.jsdelivr.net/npm/containor@5.0.0/dist/containor.min.js"></script>
```
