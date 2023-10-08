# Change Log - @fabernovel/heart-greenit

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0
Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Use the grade for the main note, and set the normalized note as the number over 100
- Move to ES modules mechanism

### Patches

- Add a suggestion when the GreenIT Analysis dependency fails with a vague error
- The date and time of the report is now correct

## 3.1.1
Wed, 14 Dec 2022 16:41:26 GMT

### Patches

- Use the correct logo for the GreenIT module

### Updates

- Update issues and repository URLs

## 3.1.0
Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @fabernovel/heart-cli 3.3.0

### Patches

- Consecutive analysis triggered by Heart API now send back the correct report instead of always the first
- Hide the messages triggered by GreenIT Analysis during or after an analysis
- The date of the report is now correct

### Updates

- Updated the url used in the example to one who will not trigger a failed analysis. Such urls must be avoided until the issue has been solved. 
- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.
- Updating dependency \"@fabernovel/heart-core\" from `^3.1.1` to `^3.2.0`

## 3.0.0
Wed, 27 Jul 2022 13:43:15 GMT

### Breaking changes

- Initial release of the GreenIT module

