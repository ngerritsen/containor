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

## Todo

- Documentation
- Checking dependencies without name strings
- Raw arguments
- Browser/environment polyfills
