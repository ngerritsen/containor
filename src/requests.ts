import { Request } from "./types";
import { Token } from "./token";

class Requests {
  private requests: Request[] = [];

  public add(token: Token, callback: () => void): void {
    this.requests.push({ token, callback });
  }

  public fulfill(token: Token): void {
    this.requests
      .filter((request) => request.token.name === token.name)
      .forEach((request) => request.callback());

    this.remove(token);
  }

  public has(token: Token): boolean {
    return this.requests.some((request) => request.token.name === token.name);
  }

  private remove(token: Token): void {
    this.requests = this.requests.filter(
      (request) => request.token.name !== token.name
    );
  }
}

export { Requests };
