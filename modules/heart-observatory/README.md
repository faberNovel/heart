# Heart Observatory

_Heart Observatory_ is an _analysis_ module of _Heart_, which analyses URLs with _[Mozilla Observatory](https://observatory.mozilla.org/)_.

Read more about [the purpose, design and general installation of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-observatory
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

3. [Optional] Customize the _Mozilla Observatory_ scanner

    By default, the scanner used is the public one, but you can use your own: [from a local codebase](https://github.com/mozilla/http-observatory#running-a-scan-from-the-local-codebase-without-db-for-continuous-integration) or [with Docker](https://github.com/mozilla/http-observatory#running-a-local-scanner-with-docker).

    In this case, you must provide the following env values:
    ```dotenv
    OBSERVATORY_API_URL=
    OBSERVATORY_ANALYZE_URL=
    ```

# Usage

## Analysis setup

The analysis setup must use the JSON format, and follow the [Invoke assessment API Documentation](https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#invoke-assessment).

Example:

```json
{
  "host": "heart.fabernovel.com",
  "hidden": true
}
```

## Example

Starting with this situation:

> Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_
>
> You want to analyse the https://heart.fabernovel.com URL and check that the rating is at least 90

```shell
npx heart observatory --inline '{"host": "heart.fabernovel.com"}' --threshold 90
```