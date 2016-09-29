[![Build Status](https://travis-ci.org/ngerritsen/containor.svg?branch=master)](https://travis-ci.org/ngerritsen/containor)

# Containor

Simple IoC container for Javascript.

- Supports an object oriented programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

_Containor is currently ~10kb minified._

## Guide

### Installation

```bash
npm install containor
```

### Basic usage

```js
import Containor from 'containor';

const containor = new Containor();

containor.add(MyClass);

const myInstance = containor.get(MyClass);
```

### Constructor injection

```js
containor.add(OtherClass);
containor.add(MyClass).with(OtherClass);

// An instance of OtherClass is injected in myInstance's constructor!
const myInstance = containor.get(MyClass);
```

### Singletons

Sometimes you only want a single shared instance across the whole application.

```js
containor.share(MyClass);

// An myOtherInstance is the same instance as myInstance!
const myInstance = containor.get(MyClass);
const myOtherInstance = containor.get(MyClass);
```

### Raw arguments

Some classes need 'regular' arguments like config options or any other values. This is where the raw method is for.

```js
containor.add(MyClass)
  .with(OtherClass)
  .raw('someString', { myConfig: 'hello' });
```

With and raw are chainable in any order. The order of chaining determines the constructor argument order.

```js
containor.add(MyClass)
  .raw('someString')
  .with(OtherClass, AnotherClass)
  .raw({ myConfig: 'hello' });
```

## Inclusion as separate script in the browser

Containor is not yet hosted on any cdn, however if you install containor from npm there is a `dist` folder with a `containor.js` (for development) and `containor.min.js`. These scripts will put `Containor` in the global scope (the window object).

## Todo

- API reference
- Reduce size?
