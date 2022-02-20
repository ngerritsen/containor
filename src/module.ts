import { Token } from "./token";
import { Module, ProviderCallback } from "./types";

function createModule(
  provides: Token[],
  register: ProviderCallback
): () => Module {
  return () => ({
    provides,
    register,
  });
}

export { createModule, Module };
