[![Build Status](https://travis-ci.org/ngerritsen/containor.svg?branch=master)](https://travis-ci.org/ngerritsen/containor)

# Containor

Simple IoC container for Javascript.

- Supports any programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor weighs just ~4kb minified!_

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

// A dependency can be a function or a class, it will be invoked with 'new' if possible.
containor.add('Foo', Foo)
containor.add('bar', bar, ['Foo'])

const barInstance = containor.get('bar') // An instance of bar with an instance of foo as an argument
```

### Custom constuction

Sometimes you need to pass in other arguments than just instances from the container (like configs or external dependencies). You can pass in a custom function:

```js
containor.add('Baz', () => {
  const foo = containor.get('foo')
  return new Baz(foo, config)
})

const baz = containor.get('Baz') // Your manually constructed version of baz 😎
```

## Including as a script tag

Containor is not hosted on any cdn yet, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. These scripts will put `createContainer` in the global scope (on the window object).

## API

### `createContainer(name: String) => container: Container`

### `.add(name: String, constructor: Function, [dependencies: Array])`
### `.get(name: String) => instance`
