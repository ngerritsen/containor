[![Build Status](https://gitlab.com/ngerritsen/containor/badges/master/pipeline.svg)](https://gitlab.com/ngerritsen/containor/-/commits/master)

# Containor

Simple IoC container for Javascript.

- Supports any programming style.
- Resolve dependecies async.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor weighs just ~2.8kb minified!\*_

## Guide

### Installation

```bash
npm install containor
```

### Basic usage

```js
import { createContainer } from 'containor'

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

### Async dependencies

By adding a callback to `get`, it waits for the dependency (and all of it's sub-dependencies, this can be nested infinitely deep) to be registered, then runs the callback. If the dependency is already there, it will resolve immediately.

```js
container.get('Foo', foo => {
  // Runs as soon as foo is added to the container.
})

container.add('Foo', Foo)
```

_Getting dependencies async is especially handy for client side code, where scripts can load asynchronously._

### Raw arguments

Sometimes you just want to pass a raw value to a dependency instead of just other dependencies, you can do this using `raw`:

```js
import { raw } from 'containor'

function displayMessage(logger, message) {
  logger.log(message)
}

container.add('logger', () => console);
container.add('displayMessage', displayMessage, ['logger', raw('Hello world!')])

container.get('displayMessage') // Logs "Hello world!"
```

By adding an argument using `raw(value)`, it will just pass the value to the dependency instead of trying to resolve it with the container.

### Custom constuction

Sometimes you need to pass in other arguments than just instances from the container (like configs or external dependencies). You can pass in a custom function:

```js
container.add('Baz', () => {
  const foo = container.get('foo')
  return new Baz(foo, config)
})

const baz = container.get('Baz') // Your manually constructed version of Baz 😎
```

### Providers

Providers allow for lazily adding dependecies to the container. They can especially be useful to optimize performance and bundle size.

```js
container.provide(['foo'], () => {
  /* ... Load dependencies async somehow */ (foo) => {
    container.add('foo', foo)
  }
})

container.get('foo', (foo) => {
  // Foo will be instantiated async as soon as it is provided
})
```

When calling `container.provide`, you tell the container: _"As soon as you need these dependencies, I will add them to the container"_. This way you save work if you never need the dependecy at all, or later in the application's life cycle.

_Note that when calling `container.get` __without__ a callback, it will fail if the provider is providing the dependencies async, as the dependencies will not be immediately available._

## Including as a script tag

Containor is not hosted on any cdn yet, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. When included, containor put on the global window object as `Containor`.

```js
const container = Containor.createContainer()
const rawArgument = Containor.raw(123)
```

## API

### `createContainer(name: String) => container: Container`

### `.add(name: String, constructor: Function, [arguments: Array])`
### `.share(name: String, constructor: Function, [arguments: Array])`
### `.get(name: String, [callback: Function]) => instance: *|void`
### `.provide(names: Array, callback: Function)`


_\* Size measured by bundling with rollup and bublé with uglify. I will be even less when gzipped_
