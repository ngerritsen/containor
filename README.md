[![Build Status](https://travis-ci.org/ngerritsen/containor.svg?branch=master)](https://travis-ci.org/ngerritsen/containor)

# Containor

Simple IoC container for Javascript.

- Supports any programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor weighs just ~1kb minified!_

## Guide

### Installation

```bash
npm install containor
```

### Basic usage

```js
import createContainer from 'containor'

class Foo {
  constructor() {
    this.message = 'foo'
  }
}

function bar(foo) {
  return {
    fooMessage: foo.message
  }
}

const container = createContainer()

// A dependency can be a function or a class, it will be invoked with 'new' if possible.
container.add('Foo', Foo)
container.add('bar', bar, ['Foo'])

const barInstance = container.get('bar') // An instance of bar with an instance of Foo as an argument
```

### Singletons

Some dependencies you want to use the same instance of everywhere (for instance one that stores state):

```js
function counter() {
  let count = 0
  return { increment: () => ++count }
}

container.share('counter', counter);

container.get('counter').increment() // returns '1'
container.get('counter').increment() // returns '2' because it's the same instance 👍
```

### Custom constuction

Sometimes you need to pass in other arguments than just instances from the container (like configs or external dependencies). You can pass in a custom function:

```js
container.add('Baz', () => {
  const foo = container.get('foo')
  return new Baz(foo, config)
})

const baz = container.get('Baz') // Your manually constructed version of Baz 😎
```

### Lazy resolving

This is handy for client side code, where scripts load asynchronously. Lazy waits for the dependency to be registered, then runs the callback.

```js
container.lazy('Foo', foo => {
  // Runs as soon as foo is added to the container.
})

container.add('Foo', Foo)
```

## Including as a script tag

Containor is not hosted on any cdn yet, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. These scripts will put `createContainer` in the global scope (on the window object).

## API

### `createContainer(name: String) => container: Container`

### `.add(name: String, constructor: Function, [dependencies: Array])`
### `.get(name: String) => instance`
