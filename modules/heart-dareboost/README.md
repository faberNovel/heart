# Heart Dareboost

![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=Coverage%3A+Heart+Dareboost)

_Heart Dareboost_ is an _analysis_ module of _Heart_, which analyses URLs with _[Dareboost](https://www.dareboost.com/)_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-dareboost
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

3. In the project root folder, create a `.env` file with the _Dareboost_ API token:

    ```dotenv
    DAREBOOST_API_TOKEN=My_Dareboost_Api_Token
    ```

# Usage

## General

Regardless the _runner_ module with which you wish to start the analysis, the JSON data must follow the [Dareboost API (_Analyse a page_ section)](https://www.dareboost.com/en/documentation-api#analyse), except the `token` property, that you set up during the installation.

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _Dareboost_ analysis of https://about.gitlab.com could look like that:

```shell
npx heart dareboost --inline '{"url":"https://about.gitlab.com","location":"Paris"}'
```
