# Description

_Heart API_ is a _runner_ module of _Heart_, which exposes an HTTP API that starts an analysis when it is requested.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project

    ```shell
    npm install @fabernovel/heart-api
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

# Usage

## General

Start the Node.js server, and make it listen to `127.0.0.1:3000` (you can specify a custom port with the `--port` option):

```shell
npx heart api
```

From now on, the HTTP API is available and exposes the endpoints according to the following rules:
* there are as many endpoints as there are _analysis_ modules installed
* the endpoints names are the package name, without the prefix `@fabernovel/heart-`
* the endpoints requests must be done using the `POST` HTTP verb
* the endpoints requests must have a JSON-formatted body whose content depends of the module. Read their dedicated README.

## Example

Starting with this situation:

> The server is listening on port 3000
>
> The _[Heart Dareboost](https://www.npmjs.com/package/@fabernovel/heart-dareboost)_ _analysis_ module is installed (package name: `@fabernovel/heart-dareboost`)
>
> You want to analyse the https://about.gitlab.com URL

You can do the following request on `127.0.0.1:3000`:

```http
POST /dareboost
Content-type: application/json
{
  "url": "https://about.gitlab.com",
  "lang": "en",
  "isPrivate": true,
  "visualMetrics": true
}
```
