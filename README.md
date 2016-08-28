# Containor

Simple IoC container for Javascript.

- Supports an object oriented programming style.
- Does not make any assumptions on your stack.
- No dependencies! 🎂

## Basic usage

```js
const containor = new Containor;

containor.add(MyClass);

const myInstance = containor.get(MyClass);
```

## Constructor injection


```js
containor.add(OtherClass);
containor.add(MyClass).withArguments(OtherClass);

// An instance of OtherClass is injected in myInstance's constructor!
const myInstance = containor.get(MyClass);
```

## Todo

- Documentation
- Checking dependencies without name strings
- Raw arguments
- Browser/environment polyfills
