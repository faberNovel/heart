# Description

_Heart Dareboost_ is an _analysis_ module of _Heart_, which analyses URLs by using the _[Dareboost](https://www.dareboost.com/)_ service.

Note that you must have installed a _runner_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/heart-dev/wikis/What-is-Heart).

# Installation

1. Add the package to your project:

```shell
npm install @fabernovel/heart-dareboost
```

2. Add the _Dareboost_ API token as environment variable:

```shell
DAREBOOST_API_TOKEN=My_Dareboost_Api_Token
```

# Usage

## General

Regardless the _runner_ module with which you wish to start the analysis, the JSON data must follow the [Dareboost API (_Analyse a page_ section)](https://www.dareboost.com/en/documentation-api#analyse), except the `token` property, that you set up during the installation.

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _Dareboost_ analysis of https://about.gilab.com could look like that:

```shell
npx heart /dareboost '{"url":"https://about.gilab.com","location":"Paris"}'
```
