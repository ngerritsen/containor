import { validateArguments, invariant } from "./utils";
import {
  Argument,
  Func,
  Dependency,
  Creator,
  GetCallback,
  Constructor,
} from "./types";
import { RawArgument } from "./raw";
import { Token } from "./token";
import { Providers } from "./providers";
import { Requests } from "./requests";
import { Dependencies } from "./dependencies";

class Container {
  private dependencies: Dependencies;
  private providers: Providers;
  private requests: Requests;

  public constructor() {
    this.providers = new Providers();
    this.requests = new Requests();
    this.dependencies = new Dependencies();
  }

  public add<T>(
    token: Token<T>,
    creator: Creator<T>,
    args: Argument[] = []
  ): void {
    this.register<T>(token, creator, args, "add");
  }

  public share<T>(
    token: Token<T>,
    creator: Creator<T>,
    args: Argument[] = []
  ): void {
    this.register<T>(token, creator, args, "share", true);
  }

  public constant<T>(token: Token<T>, value: T): void {
    this.register<T>(token, () => value, [], "constant", true);
  }

  private register<T>(
    token: Token<T>,
    creator: Creator<T>,
    args: Argument[],
    method: string,
    shared = false
  ): void {
    validateArguments(method, [
      [token, Token, true],
      [creator, "function", true],
      [args, "array"],
    ]);

    this.dependencies.add<T>(token, creator, args, shared);
    this.requests.fulfill(token);
  }

  public get<T>(token: Token<T>): T {
    validateArguments("get", [[token, Token, true]]);

    if (this.providers.has(token)) {
      this.providers.notify(token);
    }

    return this.instantiate(this.dependencies.get<T>(token));
  }

  public getAsync<T>(token: Token<T>): Promise<T> {
    validateArguments("getAsync", [[token, Token, true]]);

    if (this.providers.has(token)) {
      this.providers.notify(token);
    }

    if (this.dependencies.has(token)) {
      return Promise.resolve(this.instantiate(this.dependencies.get<T>(token)));
    }

    return new Promise((resolve) => {
      this.requests.add(token, () => {
        this.instantiateAsync<T>(this.dependencies.get<T>(token), resolve);
      });
    });
  }

  public provide(tokens: Token[]): Promise<void> {
    validateArguments("provide", [[tokens, "array", true]]);

    const existing = tokens.find((token) => this.dependencies.has(token));

    invariant(
      !existing,
      `Trying to provide dependency "${
        existing && existing.name
      }" which already exists.`
    );

    if (tokens.some((token) => this.requests.has(token))) {
      this.providers.add(tokens, () => {}, true);
      return Promise.resolve();
    }

    let resolver: () => void;

    const promise = new Promise<void>((resolve) => {
      resolver = resolve;
    });

    this.providers.add(tokens, resolver);

    return promise;
  }

  private instantiate<T>(dependency: Dependency<T>): any {
    if (dependency.shared) {
      return dependency.instance || this.createSingle<T>(dependency);
    }

    return this.create<T>(dependency);
  }

  private instantiateAsync<T>(
    dependency: Dependency<T>,
    callback: GetCallback<T>
  ): any {
    if (dependency.shared) {
      return dependency.instance
        ? callback(dependency.instance)
        : this.createSingleAsync<T>(dependency, callback);
    }

    return this.createAsync<T>(dependency, callback);
  }

  private create<T>(dependency: Dependency<T>): T {
    return this.construct<T>(dependency.creator, this.resolve(dependency.args));
  }

  private createAsync<T>(
    dependency: Dependency<T>,
    callback: GetCallback<T>
  ): void {
    this.resolveAsync(dependency.args, (resolvedArgs: unknown[]) =>
      callback(this.construct<T>(dependency.creator, resolvedArgs))
    );
  }

  private createSingle<T>(dependency: Dependency<T>): T {
    dependency.instance = this.create(dependency);

    return dependency.instance;
  }

  private createSingleAsync<T>(
    dependency: Dependency<T>,
    callback: GetCallback<T>
  ): any {
    this.createAsync(dependency, (newInstance: T) => {
      dependency.instance = newInstance;
      callback(newInstance);
    });
  }

  private resolve(args: Argument[]): unknown[] {
    return args.map((arg) =>
      arg instanceof RawArgument ? arg.value : this.get(arg)
    );
  }

  private resolveAsync(
    args: Argument[],
    callback: (resolvedArgs: unknown[]) => void
  ): void {
    args.reduceRight(
      (next, arg) => (resolvedArgs: unknown[]) => {
        return arg instanceof RawArgument
          ? next([...resolvedArgs, arg.value])
          : this.getAsync(arg).then((dependency) =>
              next([...resolvedArgs, dependency])
            );
      },
      callback
    )([]);
  }

  private construct<T>(creator: Creator<T>, args: unknown[]): T {
    return creator.hasOwnProperty("prototype")
      ? new (creator as Constructor<T>)(...args)
      : (creator as Func<T>)(...args);
  }
}

function createContainer(): Container {
  return new Container();
}

export { Container, createContainer };
