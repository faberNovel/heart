# Change Log - @fabernovel/heart-cli

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0
Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Improve the environment variables verification for the analysis module: only the ones of the analysis module used are now verified
- Improve the configurations options: a unique --config option replaces both the --inline and --file ones
- Move to ES modules mechanism

### Minor changes

- Add the except-listeners and only-listeners options, to reduce the list of listeners modules triggered after an analysis. Both options accept a comma-separated list of module IDs (e.g. greenit)
- Improve the summary of the analysis: the grade is now displayed too if provided by the analysis service

### Patches

- The version of the CLI (heart -V) now matches the module version set in package.json
- Add the reason of the error if the analysis fails

### Updates

- Update issues and repository URLs
- Improve validation of environment variables using JSON Schema specifications
- Initial release of the verbose mode, which displays debug information for every module
- Add the ability to migrate databases from the new database listener modules

## 3.3.0
Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Add the --cors options for the server modules, to allow the definition of HTTP CORS headers
- Add a spinner during the analysis to show that Heart is working
- Add a threshold mecanism available with the --threshold option. You can now validate that the `normalizedNote` of an analysis meet yourt requirements.
- Move the input validation to @fabernovel/heart-core

### Updates

- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.

## 3.2.0
Wed, 27 Jul 2022 13:43:15 GMT

### Minor changes

- Load default environment values if they are set

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.1.1
Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Improve the code to allow the implementation of automated tests

## 3.1.0
Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Fix the console message if there is no link to an online report
- Update the link to the purpose of Heart in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.0.2
Fri, 19 Jul 2019 09:41:14 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

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

