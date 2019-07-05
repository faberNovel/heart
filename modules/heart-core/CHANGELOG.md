## [1.5.0] - 2019-06-13
### Added
- Added support for POST request with 'Content-Type: application/x-www-form-urlencoded'

## [1.4.0] - 2019-06-13
### Added
- Added NormalizedNote property to the Report object to uniformize different kind of note scales

## [1.3.2] - 2019-06-05
### Added
- Missing StorageInterface

### Removed
- TypeScript module resolution, as it was causing errors in build files

## [1.3.1] - 2019-06-05
### Fixed
- Changelog was not up-to-date with NPM version

## [1.3.0] - 2019-06-05
### Added
- Introduced the new type of module by his interface: Storage, which will store analysis data

### Changed
- Imports now use TypeScript namespaces

### Deprecated
- NotificationEvents is now deprecated, and will be removed in 2.0

## [1.2.2] - 2019-04-17
### Fixed
- Gitlab CD is now able to deploy to NPM after the use of the `npm version` command

## [1.2.1] - 2019-04-17
### Fixed
- The `lib` directory is now properly ignored from Git

## [1.2.0] - 2019-04-17
### Added
- Module guards and interfaces for notification and analysis modules
- Module loading methods

### Changed
- Reorganized directories structure

## [1.1.0] - 2019-04-17
### Added
- Modules loader, guards and interfaces for notification and analysis modules

## [1.0.0] - 2019-04-10
### Added
- First release of the core part of the modules-oriented architecture of the _Heart_ project
