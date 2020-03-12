# Heart Observatory

_Heart Observatory_ is an _analysis_ module of _Heart_, which analyses URLs with _[Mozilla Observatory](https://observatory.mozilla.org/)_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

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

3. In the project root folder, create a `.env` file with the API and results URLs:

    ```dotenv
    OBSERVATORY_API_URL=https://http-observatory.security.mozilla.org/api/v1/
    OBSERVATORY_ANALYZE_URL=https://observatory.mozilla.org/analyze/
    ```

    Note that these URLs are customizable because you can run the _Mozilla Observatory_ scanner [from a local codebase](https://github.com/mozilla/http-observatory#running-a-scan-from-the-local-codebase-without-db-for-continuous-integration) or [with Docker](https://github.com/mozilla/http-observatory#running-a-local-scanner-with-docker).

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

> The _[Heart API](https://www.npmjs.com/package/@fabernovel/heart-api)_ _runner_ module is installed
>
> The server is listening on port 3000
>
> You want to analyse the heart.fabernovel.com host

You can do the following request on `127.0.0.1:3000`:

```http
POST /observatory
Content-type: application/json
{
  "host":"heart.fabernovel.com"
}
```
