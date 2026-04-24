import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.js",
      exports: "named",
      format: "cjs",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/containor.min.js",
      format: "iife",
      exports: "named",
      name: "Containor",
    },
    plugins: [typescript(), terser()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/containor.js",
      format: "iife",
      exports: "named",
      name: "Containor",
    },
    plugins: [typescript()],
  },
];
