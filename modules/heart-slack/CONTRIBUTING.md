# Contribute to _Heart Slack_

## Propose new features, bug or security fixes, ...

If you want to propose new features or fixes, you have to:
1. Make sure that _Heart Slack_ is the right repository amongst every _Heart_-related module
1. Code your stuff in a dedicated branch
2. Propose your changes through a _Merge request_:
    * the destination branch must be `master`
    * at least one reviewer: [Damien Aulombard](https://gitlab.com/damien.aulombard), who is the Product Owner of the _Heart_ ecosystem
3. Merge your code once the reviewers approved your changes

## Tag a release

When the code is tested and stable enough on the `master` branch, a new release could be tagged.

To do so, you need to:
1. Create a new branch that will contains the changes related to the release.
2. Update `CHANGELOG.md` and increase the `version` field of the `package.json` file. **See the Changelog section below on how to write a changelog and how to choose the version number**.
3. Create a _Merge request_, then merge it
4. Create a new tag using [the _GitLab_ UI](https://gitlab.com/fabernovel/heart/heart-server/tags/new); don't forget to fill in the _Release notes_ section with what you add to the Changelog.

### Changelog

The changelog must be update for each release, and follows the rules described on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/):

Guiding Principles:

* Changelogs are for humans, not machines.
* There should be an entry for every single version.
* The same types of changes should be grouped.
* Versions and sections should be linkable.
* The latest version comes first.
* The release date of each version is displayed.
* Mention whether you follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of changes:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for soon-to-be removed features.
* `Removed` for now removed features.
* `Fixed` for any bug fixes.
* `Security` in case of vulnerabilities.
