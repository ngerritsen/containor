import { Provider } from "./types";
import { Token } from "./token";
import { invariant } from "./utils";

class Providers {
  private providers: Provider[] = [];
  private reservations = new Set<string>();

  public add(
    tokens: Token[],
    callback: () => void,
    called = false,
    reserved = false
  ): void {
    tokens.forEach((token) => {
      invariant(
        token instanceof Token,
        `Trying to provide non token argument.`
      );

      invariant(
        reserved || !this.reservations.has(token.name),
        `Provider for "${token.name}" is already reserved.`
      );

      invariant(
        !this.has(token),
        `Dependency "${token.name}" is already being provided.`
      );
    });

    this.providers.push({ tokens, callback, called });

    tokens.forEach((token) => {
      if (reserved) {
        this.cancelReservation(token);
      }
    });
  }

  public has(token: Token): boolean {
    return Boolean(this.get(token));
  }

  public notify(token: Token): void {
    const provider = this.get(token);

    if (provider) {
      provider.callback();
      provider.called = true;
    }
  }

  private get(token: Token): Provider | void {
    return this.providers.find(
      (provider) =>
        !provider.called &&
        provider.tokens.some(
          (providerToken) => providerToken.name === token.name
        )
    );
  }

  public reserve(token: Token): void {
    invariant(
      !this.reservations.has(token.name),
      `Provider for "${token.name}" is already reserved.`
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

export { Providers };
