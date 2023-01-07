# Description

_Heart API_ is a _runner_ module of _Heart_, which exposes an HTTP API that starts an analysis when it is requested.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the purpose, design and general installation of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Usage

1. Add the package to your project, _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_:

    ```shell
    npm install @fabernovel/heart-cli @fabernovel/heart-api @fabernovel/heart-greenit
    ```

2. Start the server

    ```shell
    npx heart api
    ```

    You now have an HTTP server listening to `127.0.0.1:3000`, with a `/greenit` endpoint where you could `POST` your analysis configuration (JSON-formatted) to start an analysis.

    You can change the default port with the `--port` option, and specify HTTP CORS headers with the `--cors` one.

3. Start an analysis

    ```http
    POST /greenit?threshold=85
    Content-type: application/json
    {
      "url": "https://www.fabernovel.com"
    }
    ```

    The request's body depends of the analysis module; read their README.