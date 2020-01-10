# Description

_Heart SSL Labs Server_ is an _analysis_ module of _Heart_, which analyses URLs with _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-ssllabs-server
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

# Usage

## General

Regardless the _runner_ module with which you wish to start the analysis, the JSON data must follow the [SSL Labs API v3 (_Invoke assessment and check progress_ section)](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _Qualys SSL Labs server_ analysis of `about.gitlab.com` could look like that:

```shell
npx heart ssllabs-server --inline '{"host":"about.gitlab.com","fromCache":"on"}'
```
