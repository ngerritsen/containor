import { Provider } from "./types";
import { Token } from "./token";
import { invariant } from "./utils";

class Providers {
  private providers: Provider[] = [];

  public add(tokens: Token[], callback: () => void, called = false): void {
    tokens.forEach((token) => {
      invariant(
        token instanceof Token,
        `Trying to provide non token argument.`
      );
      invariant(
        !this.has(token),
        `Trying to provide dependency "${token.name}" which is already provided.`
      );
    });

    this.providers.push({ tokens, callback, called });
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
}

export { Providers };
