// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["text-summary"],

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./tests",

  // The test environment that will be used for testing
  testEnvironment: "node",
};
