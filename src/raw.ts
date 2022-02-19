function raw<T>(value: T): RawArgument<T> {
  return new RawArgument<T>(value);
}

class RawArgument<T> {
  public constructor(public readonly value: T) {}
}

export { raw, RawArgument };
