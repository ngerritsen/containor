# API Reference

## Container

### createContainer()

```ts
createContainer() => Container
```

Creates a new instance of Containor.

### container.add()

```ts
.add<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void
```

Add a dependency to the container. Optionally define it's dependencies. Creator has be a constructor of type `T` or a function with return type `Y`.

### container.addAsync()

```ts
.addAsync<T>(token: Token<T>, asyncCreator: Promise<Creator<T>>, [arguments: (Token | RawArgument)[]]): Promise<void>
```

Add a dependency to the container asynchronously. Optionally define it's dependencies. Creator has be a promise resolving to a constructor of type `T` or a function with return type `Y`. Returns a promise that resolves when the dependency resolves.

### container.share()

```ts
.share<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void
```

Add a singleton dependency to the container. Optionally define it's dependencies. Creator has be a constructor of type `T` or a function with return type `Y`.

### container.shareAsync()

```ts
.shareAsync<T>(token: Token<T>, asyncCreator: Promise<Creator<T>>, [arguments: (Token | RawArgument)[]]): Promise<void>
```

Add a singleton dependency to the container asynchronously. Optionally define it's dependencies. Creator has be a promise resolving to a constructor of type `T` or a function with return type `Y`. Returns a promise that resolves when the dependency resolves.

### container.constant()

```ts
.constant<T>(token: Token<T>, value: T): void
```

Add a constant value to the container. Value has to be of type `T`.

### container.constantAsync()

```ts
.constantAsync<T>(token: Token<T>, asyncValue: Promise<T>): Promise<void>
```

Add a constant value to the container asynchronously. Value has to be a promise resolving to type `T`. Returns a promise that resolves when the constant resolves.

### container.get()

```ts
.get<T>(token: Token): T
```

Get a dependency from the container. Returns the instance.

### container.getAsync()

```ts
.getAsync<T>(token: Token): Promise<T>
```

Get a dependency from the container asynchronously. Resolves with an instance when the dependency has been resolved.

### container.provide()

```ts
.provide(tokens: Token[], provider: (container: Container) => void): void
```

Register a provider of dependencies, triggers the provided provider function when one of the tokens is being requested.

### container.provideAsync()

```ts
.provideAsync(tokens: Token[], provider: Promise<(container: Container) => void>): Promise<void>
```

Register a provider of dependencies asynchronously, triggers the provided provider function when one of the tokens is being requested.

### container.use()

```ts
.use(module: Module): void
```

Register a module as a provider of dependencies, triggers the modules register function when one of the modules provided tokens is being requested.

### container.useAsync()

```ts
.useAsync(asyncModule: Promise<Module>): Promise<void>
```

Register a module as a provider of dependencies asynchronously, triggers the modules register function when one of the modules provided tokens is being requested.

## Token

### token()

```ts
token<T>(name: string) => Token<T>
```

Create a new token, the name has to be unique when registering.

## Module

### createModule

```ts
createModule(provides: Token[], register: (container: Container) => void) => Module
```

Create a new module that can be added to the container to provide dependencies.

## Raw argument

### raw()

```ts
raw<T>(value: string) => RawArgument<T>
```

Create a new raw argument.

## Object oriented

Object oriented class constructors/interfaces are available for those who prefer that.

### new Container()

```ts
new Container() => Container
```

### new Token()

```ts
new Token<T>(name: string) => Token<T>
```

### new RawArgument()

```ts
new RawArgument<T>(value: T) => RawArgument<T>
```

### interface Module {}

```ts
interface Module {
  provides: Token[];
  register: (container: Container) => void;
}
```
