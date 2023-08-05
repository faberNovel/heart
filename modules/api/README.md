# Description

_Heart API_ is a _runner_ module of _Heart_, which exposes an HTTP API that starts an analysis when it is requested.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

1. Install the package and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_

    ```bash
    npm install @fabernovel/heart-api @fabernovel/heart-greenit
    ```

    If you are using Yarn, npm < 7 or PNPM < 8 as package manager, you also have to install _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ (which is automatically installed if you have more recent versions):

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. Start the server

    ```bash
    npx heart api
    ```

    You now have an HTTP server listening to `127.0.0.1:3000`, with a `/greenit` endpoint where you could `POST` your analysis configuration (JSON-formatted) to start an analysis.

    You can change the default port with the `--port` option, and specify HTTP CORS headers with the `--cors` one.

3. Start an analysis

    ```http
    POST /greenit
    Content-type: application/json
    {
      "config": {
        "url": "https://www.fabernovel.com"
      }
    }
    ```

    The analysis configuration set with the request's body follows the JSON format, and depends of the analysis module; read their README.