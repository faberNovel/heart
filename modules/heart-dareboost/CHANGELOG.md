# Change Log - @fabernovel/heart-dareboost

This log was last generated on Fri, 02 Aug 2019 12:02:44 GMT and should not be manually modified.

## 3.1.0
Fri, 02 Aug 2019 12:02:44 GMT

### Minor changes

- Add service logo

### Patches

- Improve the example of request in the README by correcting a misspelling

## 3.0.1
Fri, 19 Jul 2019 09:43:15 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

## 3.0.0
Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Add Heart CLI as a peer dependency: it must be installed to make this module usable
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Heart module shares the same major version number

### Minor changes

- Improve the module installation: it can now be installed as a devDependency
- Add environment variable creation from a .env file

### Patches

- Remove the contributing guide and the license: they are now available in the Heart repository
- Remove unnecessary dependencies and scripts from package.json
- Update the readme to reflect the changes introduced by this major release

