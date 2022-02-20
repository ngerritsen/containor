# API Reference

## Container

##### `createContainer() => Container`

Creates a new instance of Containor.

##### `.add<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a dependency to the container. Optionally define it's dependencies. Creator has be a constructor of type `T` or a function with return type `Y`.

##### `.addAsync<T>(token: Token<T>, asyncCreator: Promise<Creator<T>>, [arguments: (Token | RawArgument)[]]): Promise<void>`

Add a dependency to the container asynchronously. Optionally define it's dependencies. Creator has be a promise resolving to a constructor of type `T` or a function with return type `Y`. Returns a promise that resolves when the dependency resolves.

##### `.share<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a singleton dependency to the container. Optionally define it's dependencies. Creator has be a constructor of type `T` or a function with return type `Y`.

##### `.shareAsync<T>(token: Token<T>, asyncCreator: Promise<Creator<T>>, [arguments: (Token | RawArgument)[]]): Promise<void>`

Add a singleton dependency to the container asynchronously. Optionally define it's dependencies. Creator has be a promise resolving to a constructor of type `T` or a function with return type `Y`. Returns a promise that resolves when the dependency resolves.

##### `.constant<T>(token: Token<T>, value: T): void`

Add a constant value to the container. Value has to be of type `T`.

##### `.constantAsync<T>(token: Token<T>, asyncValue: Promise<T>): Promise<void>`

Add a constant value to the container asynchronously. Value has to be a promise resolving to type `T`. Returns a promise that resolves when the constant resolves.

##### `.get<T>(token: Token): T`

Get a dependency from the container. Returns the instance.

##### `.getAsync<T>(token: Token): Promise<T>`

Get a dependency from the container asynchronously. Resolves with an instance when the dependency has been resolved.

##### `.provide(tokens: Token[], provider: (container: Container) => void): void`

Register a provider of dependencies, triggers the provided provider function when one of the tokens is being requested.

##### `.provideAsync(tokens: Token[], provider: Promise<(container: Container) => void>): Promise<void>`

Register a provider of dependencies asynchronously, triggers the provided provider function when one of the tokens is being requested.

##### `.use(module: Module): void`

Register a module as a provider of dependencies, triggers the modules register function when one of the modules provided tokens is being requested.

##### `.useAsync(asyncModule: Promise<Module>): Promise<void>`

Register a module as a provider of dependencies asynchronously, triggers the modules register function when one of the modules provided tokens is being requested.

## Token

##### `token<T>(name: string) => Token<T>`

Create a new token, the name has to be unique when registering.

## Module

##### `createModule(provides: Token[], register: (container: Container) => void) => Module`

Create a new module that can be added to the container to provide dependencies.

## Raw argument

##### `raw<T>(value: string) => RawArgument<T>`

Create a new raw argument.

## Class constructors

Class constructors are available for those who prefer that.

##### `new Container() => Container`

##### `new Token<T>(name: string) => Token<T>`

##### `new RawArgument<T>(value: T) => RawArgument<T>`

##### `interface Module { provides: Token[], register: (container: Container) => void }`
