import { Creator, Dependency, Creates, Arguments, Argument } from "./types";
import { Token } from "./token";
import { invariant } from "./utils";

class Dependencies {
  private dependencies = new Map<string, Dependency>();
  private reservations = new Set<string>();

  public add<T extends Creator>(
    token: Token<Creates<T>>,
    creator: T,
    args: Arguments<T>,
    shared = false,
    reserved = false
  ): void {
    invariant(
      !this.dependencies.get(token.name),
      `Dependency "${token.name}" already exists.`
    );

    invariant(
      reserved || !this.reservations.has(token.name),
      `Dependency "${token.name}" has already been reserved.`
    );

    const argsArr: Argument[] = Array.isArray(args) ? args : [];

    invariant(
      !argsArr.some(
        (arg: Argument) => arg instanceof Token && arg.name === token.name
      ),
      `Trying to add a recursive dependency "${token.name}".`
    );

    this.dependencies.set(token.name, {
      token,
      creator,
      args: argsArr,
      shared,
    });

    if (reserved) {
      this.cancelReservation(token);
    }
  }

  public get<T>(token: Token): Dependency<T> {
    invariant(this.has(token), `Dependency "${token.name}" does not exist.`);

    return this.dependencies.get(token.name) as Dependency<T>;
  }

  public has(token: Token): boolean {
    return this.dependencies.has(token.name);
  }

  public reserve(token: Token): void {
    invariant(
      !this.reservations.has(token.name),
      `Dependency "${token.name}" is already reserved.`
    );

    this.reservations.add(token.name);
  }

  public cancelReservation(token: Token): void {
    this.reservations.delete(token.name);
  }

  public isReserved(token: Token): boolean {
    return this.reservations.has(token.name);
  }
}

export { Dependencies };
