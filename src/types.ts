import { RawArgument } from "./raw";
import { Token } from "./token";

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

export type Provider = {
  tokens: Token[];
  called?: boolean;
  callback: () => void;
};

export type GetCallback<T> = (instance: T) => void;

export type Container = {
  add: <T>(token: Token<T>, creator: Creator<T>, args?: Token[]) => void;
  share: <T>(token: Token<T>, creator: Creator<T>, args?: Token[]) => void;
  provide: (token: Token<unknown>[]) => Promise<void>;
  get: <T>(token: Token<T>) => T;
  getAsync: <T>(token: Token<T>) => Promise<T>;
};
