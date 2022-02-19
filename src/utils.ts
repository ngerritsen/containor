import { Constructor } from "./types";

const indices = ["First", "Second", "Third"];

export function validateArguments(
  method: string,
  options: [any, string | Constructor<unknown>, boolean?][]
): void {
  options.map(([value, expected, required], index) => {
    const expectedName =
      typeof expected === "string" ? expected : expected.name;

    const matches = typeMatches(expected, value);

    return invariant(
      required ? matches : value === undefined || value === null || matches,
      `${
        indices[index]
      } argument of "${method}" should be of type: "${expectedName}", received: "${typeof value}".`
    );
  });
}

function typeMatches(
  expected: string | Constructor<unknown>,
  value: any
): boolean {
  if (typeof expected === "string") {
    const type = Array.isArray(value) ? "array" : typeof value;
    return type === expected;
  }

  return value instanceof (expected as Constructor<unknown>);
}

export function invariant(condition: any, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}
