<img src="./docs/images/logo.svg" alt="Containor Logo" width="80">

# Containor

[![Build Status](https://gitlab.com/ngerritsen/containor/badges/master/pipeline.svg)](https://gitlab.com/ngerritsen/containor/-/commits/master)

Simple IOC/DI container for Javascript with Typescript support.

- Supports any programming style.
- Typescript support.
- Resolve dependecies async.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor weighs just ~3.6kb minified!\*_

## [📖 Documentation](https://ngerritsen.gitlab.io/containor)

- [Getting Started](https://ngerritsen.gitlab.io/containor/#/getting-started)
- [Motivation](https://ngerritsen.gitlab.io/containor/#/motivation)
- [Guide](https://ngerritsen.gitlab.io/containor/#/guide)
- [API Reference](https://ngerritsen.gitlab.io/containor/#/api-reference)
- [Examples](https://ngerritsen.gitlab.io/containor/#/examples/)

## Getting started

### Installation

Containor can be installed by using any package manager using the npm repository.

```bash
npm install containor
```

With yarn:

```bash
yarn add containor
```

> Containor ships with Typescript types included, these do not have to be installed separately.

### Basic usage

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
