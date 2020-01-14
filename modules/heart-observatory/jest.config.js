// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["text-summary"],

  // A set of global variables that need to be available in all test environments
  globals: {
    "ts-jest": {
      packageJson: "package.json",
      tsConfig: "tsconfig.test.json"
    }
  },

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./",

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src/",
    "<rootDir>/tests/"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",
};
