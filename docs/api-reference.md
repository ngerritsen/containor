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

##### `.get<T>(token: Token, callback: (T) => void): void`

Get a dependency from the container, when a callback is provided, will wait for all dependencies to be available.

##### `.provide(tokens: Token[], callback: () => void): void`

Register as a provider of dependencies, will get notified via the callback when a dependency is requested.

## Token

##### `token<T>(name: string) => Token<T>`

## Raw argument

##### `raw<T>(value: string) => RawArgument<T>`
