import { Creator, Dependency, Argument } from "./types";
import { Token } from "./token";
import { invariant } from "./utils";

class Dependencies {
  private dependencies = new Map<string, Dependency>();

  public add<T>(
    token: Token,
    creator: Creator<T>,
    args: Argument[] = [],
    shared = false
  ): void {
    invariant(
      !this.dependencies.get(token.name),
      `Dependency "${token.name}" already exists.`
    );

    invariant(
      !args.some((arg) => arg instanceof Token && arg.name === token.name),
      `Trying to add a recursive dependency "${token.name}".`
    );

    this.dependencies.set(token.name, { token, creator, args, shared });
  }

  public get<T>(token: Token): Dependency<T> {
    invariant(this.has(token), `Dependency "${token.name}" does not exist.`);

    return this.dependencies.get(token.name) as Dependency<T>;
  }

  public has(token: Token): boolean {
    return this.dependencies.has(token.name);
  }
}

export { Dependencies };
