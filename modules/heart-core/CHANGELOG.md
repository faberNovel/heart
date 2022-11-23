# Change Log - @fabernovel/heart-core

This log was last generated on Wed, 23 Nov 2022 17:16:17 GMT and should not be manually modified.

## 3.3.0
Wed, 23 Nov 2022 17:16:17 GMT

### Minor changes

- Add the optional cors parameter to the startServer method of the ModuleServerInterface, and make the port parameter mandatory
- Add the threshold feature
- Add the input validation (previously located in @fabernovel/heart-cli)

## 3.1.2
Wed, 27 Jul 2022 13:43:15 GMT

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.1.1
Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Improve unit test by using mocks instead of real HTTP requests

## 3.1.0
Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Update the link to the purpose of Heart in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.0.1
Fri, 19 Jul 2019 09:36:21 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

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

