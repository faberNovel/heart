# Change Log - @fabernovel/heart-core

This log was last generated on Fri, 19 Jul 2019 08:17:11 GMT and should not be manually modified.

## 3.0.0
Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Remove module loading, as it is now handled by Heart CLI
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Heart module shares the same major version number

### Minor changes

- Initial release of environment variables creation from a .env file located under the root folder of the Heart installation
- Improve the module installation: it can now be installed as a devDependency

### Patches

- Remove the contributing guide and the license: they are now available in the Heart repository
- Remove unnecessary dependencies and scripts from package.json

