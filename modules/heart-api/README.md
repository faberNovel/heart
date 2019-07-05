# Description

_Heart API_ is a _runner_ module of _Heart_, which exposes an API that starts an analysis when it is requested. Technically, it starts a Node.js server that exposes the API.

Note that you must have installed an _analysis_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Installation

The package manager used in the examples below is NPM, but you can use the one you prefer: Yarn, pnpm...

1. Add the package to your project

    ```shell
    npm install @fabernovel/heart-api
    ```

2. In the project root folder, create a `.env` file with the server port and the _Node.js_ environment: 

    ```dotenv
    PORT=3000
    NODE_ENV=production
    ```

3. Add _Heart API_ to your code:

    **Vanilla JS**:

    ```javascript
    const HeartApi = require('@fabernovel/heart-api');
    
    HeartApi.default.start();
    ```

    **TypeScript**:
    
    ```typescript
    import HeartApi from '@fabernovel/heart-api';
    
    HeartApi.start();
    ```

# Usage

## General

Once the code is executed, you will have a Node.js server running on 127.0.0.1 and listening to the port you set up.

From now on, the API is available and exposes the endpoints according to the following rules:
* there are as many endpoints as there are _analysis_ modules installed
* the endpoints names are the lowercase versions of the module names, without the prefix _Heart_
* the endpoints requests must be done using the `POST` HTTP verb
* the endpoints requests must have a JSON-formatted body whose content depends of the module. Read their dedicated README.

## Example

Starting with this situation:

> The server is listening on port 3000
>
> The _[Heart Dareboost](https://www.npmjs.com/package/@fabernovel/heart-dareboost)_ _analysis_ module is installed
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
