# Description

_Heart SSL Labs Server_ is an _analysis_ module of _Heart_, which analyses URLs by using the _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_ service.

Note that you must have installed a _runner_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Installation

Add the package to your project:

```shell
npm install @fabernovel/heart-ssllabs-server
```

# Usage

## General

Regardless the _runner_ module with which you wish to start the analysis, the JSON data must follow the [SSL Labs API v3 (_Invoke assessment and check progress_ section)](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _Qualys SSL Labs server_ analysis of about.gitlab.com could look like that:

```shell
npx heart analysis --server /ssllabs-server --inline '{"host":"about.gitlab.com","fromCache":"on"}'
```
