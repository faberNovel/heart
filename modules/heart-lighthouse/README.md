# Description

_Heart Lighthouse_ is an _analysis_ module of _Heart_, which analyses URLs with _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-lighthouse
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

3. In the project root folder, create a `.env` file with the following environment variable:

```dotenv
LIGHTHOUSE_API_TOKEN=My_Lighthouse_Api_Token
```

# Usage
