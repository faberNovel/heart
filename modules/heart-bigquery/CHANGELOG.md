# Change Log - @fabernovel/heart-bigquery

This log was last generated on Wed, 23 Nov 2022 19:51:43 GMT and should not be manually modified.

## 3.3.0
Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @fabernovel/heart-cli 3.3.0

### Patches

- Fix an error that caused the module to crash if the normalized value of the note of the report was a floating point number

## 3.2.1
Wed, 27 Jul 2022 13:43:15 GMT

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.2.0
Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Fix an issue where the results could not be saved if there was no online report
- Update the link to the purpose of Heart in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.1.0
Fri, 02 Aug 2019 12:02:44 GMT

### Minor changes

- Add service logo

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

