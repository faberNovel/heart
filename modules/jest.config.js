// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  /**
   * Automatically clear mock calls, instances and results before every test.
   * Equivalent to calling jest.clearAllMocks() before each test.
   * This does not remove any mock implementation that may have been provided.
   */
  clearMocks: true,

  /**
   * An array of glob patterns indicating a set of files for which coverage information should be collected.
   * If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist for this file and it's never required in the test suite.
   */
  collectCoverageFrom: ["src/**/*"],

  /**
   * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
   */
  coverageReporters: ["text-summary"],

  /**
   * A preset that is used as a base for Jest's configuration.
   * A preset should point to an npm module that has a jest-preset.json, jest-preset.js, jest-preset.cjs or jest-preset.mjs file at the root.
   */
  preset: "ts-jest/presets/default",
}
