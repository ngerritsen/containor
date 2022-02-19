import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const tsNoDeclaration = {
  compilerOptions: {
    declaration: false,
  },
};

export default [
  {
    input: "src/container.ts",
    output: {
      file: "lib/index.js",
      exports: "named",
      format: "cjs",
    },
    plugins: [typescript({ useTsconfigDeclarationDir: true })],
  },
  {
    input: "src/container.ts",
    output: {
      file: "dist/containor.min.js",
      format: "iife",
      exports: "named",
      name: "Containor",
    },
    plugins: [
      typescript({
        tsconfigOverride: tsNoDeclaration,
      }),
      terser(),
    ],
  },
  {
    input: "src/container.ts",
    output: {
      file: "dist/containor.js",
      format: "iife",
      exports: "named",
      name: "Containor",
    },
    plugins: [
      typescript({
        tsconfigOverride: tsNoDeclaration,
      }),
    ],
  },
];
