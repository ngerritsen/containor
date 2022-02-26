import { validateArguments, invariant } from "./utils";
import {
  Argument,
  Func,
  Dependency,
  Creator,
  GetCallback,
  Constructor,
  ProviderCallback,
  Module,
  Creates,
  Arguments,
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

  public add<T extends Creator>(
    token: Token<Creates<T>>,
    creator: T,
    args?: Arguments<T>
  ): void {
    this.register(token, creator, args, "add");
  }

  public addAsync<T extends Creator>(
    token: Token<Creates<T>>,
    asyncCreator: Promise<T>,
    args?: Arguments<T>
  ): Promise<void> {
    return this.registerAsync(token, asyncCreator, args, "add", true);
  }

  public share<T extends Creator>(
    token: Token<Creates<T>>,
    creator: T,
    args?: Arguments<T>
  ): void {
    this.register(token, creator, args, "share", true);
  }

  public shareAsync<T extends Creator>(
    token: Token<Creates<T>>,
    asyncCreator: Promise<T>,
    args?: Arguments<T>
  ): Promise<void> {
    return this.registerAsync(token, asyncCreator, args, "share", true);
  }

  public constant<T>(token: Token<T>, value: T): void {
    this.register(token, () => value, [], "constant", true);
  }

  public constantAsync<T>(
    token: Token<T>,
    asyncValue: Promise<T>
  ): Promise<void> {
    return this.registerAsync(
      token,
      asyncValue.then((value: T) => () => value),
      [],
      "constant",
      true
    );
  }

  private register<T extends Creator>(
    token: Token<Creates<T>>,
    creator: T,
    args: Arguments<T>,
    method: string,
    shared = false,
    reserved = false
  ): void {
    validateArguments(method, [
      [token, Token, true],
      [creator, "function", true],
      [args, "array"],
    ]);

    this.dependencies.add<T>(token, creator, args, shared, reserved);
    this.requests.fulfill(token);
  }

  private registerAsync<T extends Creator>(
    token: Token<Creates<T>>,
    asyncCreator: Promise<T>,
    args: Arguments<T>,
    method: string,
    shared = false
  ): Promise<void> {
    this.dependencies.reserve(token);

    return asyncCreator
      .then((creator: T) => {
        this.register<T>(token, creator, args, method, shared, true);
      })
      .catch((error) => {
        this.dependencies.cancelReservation(token);
        throw error;
      });
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

  public provide(tokens: Token[], provider: ProviderCallback): void {
    validateArguments("provide", [[tokens, "array", true]]);

    const existing = tokens.find(
      (token) =>
        this.dependencies.has(token) || this.dependencies.isReserved(token)
    );

    invariant(
      !existing,
      `Trying to provide dependency "${existing && existing.name}" which ${
        existing && this.dependencies.isReserved(existing)
          ? "is already reserved"
          : "already exists"
      }.`
    );

    if (tokens.some((token) => this.requests.has(token))) {
      this.providers.add(tokens, () => {}, true);
      provider(this);
    }

    this.providers.add(tokens, () => provider(this));
  }

  public provideAsync(
    tokens: Token[],
    asyncProvider: Promise<ProviderCallback>
  ): void {
    asyncProvider.then((provider) => {
      this.provide(tokens, provider);
    });
  }

  public use(module: Creator<Module>): void {
    const moduleInstance = this.construct(module, []);

    this.provide(
      moduleInstance.provides,
      moduleInstance.register.bind(moduleInstance)
    );
  }

  public useAsync(asyncModule: Promise<Creator<Module>>): void {
    asyncModule.then((module: Creator<Module>) => {
      this.use(module);
    });
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
