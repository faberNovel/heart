/**
 * @see https://jestjs.io/docs/en/manual-mocks#examples
 */
'use strict';

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = {};
function __setMockFiles(newMockFiles) {
  mockFiles = {};

  Object.keys(newMockFiles).forEach((key) => mockFiles[key] = newMockFiles[key]);
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readFileSync(fileName) {
  const filesFound = Object.keys(mockFiles).filter((file) => {
    return (new RegExp(`${file}$`)).test(fileName);
  });

  if (filesFound.length !== 1) {
    throw new Error();
  }

  return mockFiles[filesFound[0]];
}

fs.__setMockFiles = __setMockFiles;
fs.readFileSync = readFileSync;

module.exports = fs;
