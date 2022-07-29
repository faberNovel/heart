# Heart SSL Labs Server

_Heart SSL Labs Server_ is an _analysis_ module of _Heart_, which analyses URLs with _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_.

Read more about [the purpose, design and general installation of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

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

## Analysis setup

The analysis setup must use the JSON format, and follow the [Invoke assessment and check progress API documentation](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _Qualys SSL Labs server_ analysis of `heart.fabernovel.com` could look like that:

```shell
npx heart ssllabs-server --inline '{"host":"heart.fabernovel.com","fromCache":"on"}'
```
