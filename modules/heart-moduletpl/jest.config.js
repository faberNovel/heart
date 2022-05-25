// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const defaults = require('../jest.config');

/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  clearMocks: defaults.clearMocks,
  collectCoverageFrom: defaults.collectCoverageFrom,
  coverageReporters: defaults.coverageReporters,
  preset: defaults.preset,

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./",

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src/",
    "<rootDir>/tests/"
  ],
};
