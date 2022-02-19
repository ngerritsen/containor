# API Reference

## Container

##### `createContainer() => Container`

Creates a new instance of containor.

##### `.add<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a dependency to the container. Optionally define it's dependencies. Creator can be a constructor of type `T` or a function with return type `Y`.

##### `.share<T>(token: Token<T>, creator: Creator<T>, [arguments: (Token | RawArgument)[]]): void`

Add a singleton dependency to the container. Optionally define it's dependencies. Creator can be a constructor of type `T` or a function with return type `Y`.

##### `.constant<T>(token: Token<T>, value: T): void`

Add a constant value to the container. Value has to be of type `T`.

##### `.get<T>(token: Token): T`

Get a dependency from the container.

##### `.getAsync<T>(token: Token): Promise<T>`

Get a dependency from the container asynchronously.

##### `.provide(tokens: Token[]): Promise<void>`

Register as a provider of dependencies, resolves when one of the dependencies is requested.

## Token

##### `token<T>(name: string) => Token<T>`

Create a new token, name has to be unique.

## Raw argument

##### `raw<T>(value: string) => RawArgument<T>`

Create a new raw argument.
