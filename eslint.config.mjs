import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "lib/**", "types/**"],
  },
  {
    extends: tseslint.configs.recommended,
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-plusplus": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-empty-function": "off",
    },
  },
);
