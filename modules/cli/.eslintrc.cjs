module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  ignorePatterns: ["bin/"],
  plugins: ["@typescript-eslint"],
  extends: [
    /**
     * @see https://eslint.org/docs/latest/rules/
     */
    "eslint:recommended",
    /**
     * @see https://typescript-eslint.io/rules/
     */
    "plugin:@typescript-eslint/recommended",
    /**
     * @see https://typescript-eslint.io/docs/linting/typed-linting/
     */
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    /**
     * @see https://typescript-eslint.io/linting/configs/#strict
     */
    "plugin:@typescript-eslint/strict",
  ],
}
