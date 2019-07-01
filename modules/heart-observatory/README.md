# Description

_Heart Observatory_ is an _analysis_ module of _Heart_, which analyses URLs by using the _[Mozilla Observatory](https://observatory.mozilla.org/)_ service.

Note that you must have installed a _runner_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/heart-dev/wikis/What-is-Heart).

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-observatory
    ```

2. Add the API and results URLs as environment variables:

    ```shell
    OBSERVATORY_API_URL=https://http-observatory.security.mozilla.org/api/v1/
    OBSERVATORY_ANALYZE_URL=https://observatory.mozilla.org/analyze/
    ```

    Note that these URLs are customizable because you can run the _Mozilla Observatory_ scanner [from a local codebase](https://github.com/mozilla/http-observatory#running-a-scan-from-the-local-codebase-without-db-for-continuous-integration) or [with Docker](https://github.com/mozilla/http-observatory#running-a-local-scanner-with-docker).

# Usage

## General

Regardless the _runner_ module with which you wish to start the analysis, the JSON data must follow the following format:

```json
{
  "host": "my-host.com",
  "rescan": true,
  "hidden": true
}
```

Only `host` parameter is mandatory.

See [HTTP Observatory API Documentation](https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md) for details.

## Example

Starting with this situation:

> The _[Heart API](https://www.npmjs.com/package/@fabernovel/heart-dareboost)_ _runner_ module is installed
>
> The server is listening on port 3000
>
> You want to analyse the about.gitlab.com host

You can do the following request on `127.0.0.1:3000`:

```http
POST /observatory
Content-type: application/json
{
  "host":"about.gilab.com"
}
```
