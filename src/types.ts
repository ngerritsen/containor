import { RawArgument } from "./raw";
import { Token } from "./token";
import { Container } from "./container";

export type Argument<T = unknown> = Token<T> | RawArgument<T>;

export type Constructor<T = unknown> = new (...args: any[]) => T;

export type Func<T = unknown> = (...args: any[]) => T;

export type Creator<T = unknown> = Constructor<T> | Func<T>;

export type Creates<T extends Creator> = T extends Constructor
  ? InstanceType<T>
  : T extends Func
  ? ReturnType<T>
  : never;

export type CreatorParameters<T extends Creator> = T extends Constructor
  ? ConstructorParameters<T>
  : T extends Func
  ? Parameters<T>
  : never;

export type Arguments<T extends Creator> = ToArguments<CreatorParameters<T>>;

export type ToArguments<T extends unknown[]> = {
  [K in keyof T]: Argument<T[K]>;
};

export type Request = {
  token: Token;
  callback: () => void;
};

export type Dependency<T = unknown> = {
  token: Token<T>;
  creator: Creator<T>;
  args: Argument[];
  shared: boolean;
  instance?: any;
};

export type ProviderCallback = (container: Container) => void;

export type Provider = {
  tokens: Token[];
  called?: boolean;
  callback: () => void;
};

export type GetCallback<T> = (instance: T) => void;

export interface Module {
  provides: Token[];
  register: ProviderCallback;
}
