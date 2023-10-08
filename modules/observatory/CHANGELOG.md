# Change Log - @fabernovel/heart-observatory

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0
Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Add a HEART_ prefix to the environment variables names to avoid collisions
- The module now send back detailed results instead of the summary only
- Move to ES modules mechanism

### Updates

- Update issues and repository URLs

## 3.4.0
Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @fabernovel/heart-cli 3.3.0

### Updates

- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.

## 3.3.0
Wed, 27 Jul 2022 13:43:15 GMT

### Minor changes

- The environment variables OBSERVATORY_API_URL and OBSERVATORY_ANALYZE_URL are now optional, and are set by default to use the public Mozilla Observatory API.

### Patches

- update the example section of the README.md to match with the installation section
- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.2.1
Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Improve the description of the analysis configuration in the README

## 3.2.0
Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Update the link to the purpose of Heart in the README, to redirect to the fabernovel.com website instead of the wiki

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

