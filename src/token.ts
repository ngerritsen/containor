function token<T>(name: string): Token<T> {
  return new Token<T>(name);
}

class Token<T = unknown> {
  public readonly type: T = null as T;
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export { Token, token };
