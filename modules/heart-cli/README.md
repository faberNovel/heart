# Heart CLI

_Heart CLI_ is the control module of _Heart_. It allows every other module to work together, and is able to control the _Heart API_ and the _analysis_ modules. All of that by exposing a small CLI.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

  ```shell
  npm install @fabernovel/heart-cli
  ```

  2. Add an _analysis_ module

# Usage

## General

```shell
npx heart --help
```

This command displays the list of commands you can use, regarding your installed modules.

If you install _Heart API_ or each time you install an _analysis_ module, a new command will be available.

## Example

We assume that the _analysis_ module [_Heart Observatory_](https://www.npmjs.com/package/@fabernovel/heart-observatory) is installed.

If you want to start an analysis, you can use one of the following options:

  * ```shell
    npx heart observatory --inline '{"host": "heart.fabernovel.com"}'
    ```

    Or:

  * ```shell
    npx heart observatory --file observatory.json
    ```

    With the following content for the `observatory.json` file:

    ```json
    {
      "host": "heart.fabernovel.com"
    }
    ```
