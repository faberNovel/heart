module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    /**
    * @see https://eslint.org/docs/latest/rules/
    */
    "eslint:recommended",
    /**
    * @see https://typescript-eslint.io/rules/
    */
    "plugin:@typescript-eslint/recommended"
  ]
}