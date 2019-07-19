# Change Log - @fabernovel/heart-cli

This log was last generated on Fri, 19 Jul 2019 08:19:36 GMT and should not be manually modified.

## 3.0.1
Fri, 19 Jul 2019 08:19:36 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

## 3.0.0
Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Add a command option to load analysis modules configuration from a JSON file
- Improve CLI syntax for analysis modules: each of them now has a dedicated command with options
- Add a command that starts the Heart API server, with an option to configure the port
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Heart module shares the same major version number

### Minor changes

- Improve the module installation: it can now be installed as a devDependency

### Patches

- Remove the contributing guide and the license: they are now available in the Heart repository
- Remove unnecessary dependencies and scripts from package.json
- Update the readme to reflect the changes introduced by this major release

