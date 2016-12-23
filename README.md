[![Build Status](https://travis-ci.org/ngerritsen/containor.svg?branch=master)](https://travis-ci.org/ngerritsen/containor)

# Containor

Simple IoC container for Javascript.

- Supports any programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor just about ~4kb minified!_

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

const containor = createContainer()

containor.add('Foo', Foo) // Foo can be a function or a class, it will be invoked with 'new' if possible
containor.add('bar', bar, ['Foo'])

const barInstance = containor.get('bar') // An instance of bar with an instance of foo as an argument
```

### Custom constuction

Sometimes you need to pass in other dependencies then just instances from the container (like config files or external dependencies). You can just pass in a custom function:

```js
containor.add('Baz', () => {
  const foo = containor.get('foo')
  return new Baz(foo, config)
})

const baz = containor.get('Baz') // Your manually constructed version of baz 😎
```

## Inclusion as separate script in the browser

Containor is not yet hosted on any cdn, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. These scripts will put `createContainer` in the global scope (the window object).

## API

### `createContainer(name: String) => container: Container`

### `.add(name: String, constructor: Function, [dependencies: Array])`
### `.get(name: String) => instance`
