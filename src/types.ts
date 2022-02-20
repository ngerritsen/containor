import { RawArgument } from "./raw";
import { Token } from "./token";
import { Container } from "./container";

export type Argument<T = unknown> = Token<T> | RawArgument<T>;

export type Constructor<T> = new (...args: any[]) => T;

export type Func<T> = (...args: any[]) => T;

export type Creator<T> = Constructor<T> | Func<T>;

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
