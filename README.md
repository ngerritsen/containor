# Containor

Simple IoC container for Javascript.

- Supports an object oriented programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

## Basic usage

```js
const containor = new Containor();

containor.add(MyClass);

const myInstance = containor.get(MyClass);
```

## Constructor injection

```js
containor.add(OtherClass);
containor.add(MyClass).with(OtherClass);

// An instance of OtherClass is injected in myInstance's constructor!
const myInstance = containor.get(MyClass);
```

## Singletons

Sometimes you only want a single shared instance across the whole application.

```js
containor.share(MyClass);

// An myOtherInstance is the same instance as myInstance!
const myInstance = containor.get(MyClass);
const myOtherInstance = containor.get(MyClass);
```

## Raw arguments

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
  .with(OtherClass)
  .raw({ myConfig: 'hello' });
```

## Todo

- API reference
- Checking dependencies without name strings
- Browser/environment polyfills
