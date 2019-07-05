# Description

_Heart Lighthouse_ is an _analysis_ module of _Heart_, which analyses URLs by using the _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_ service.

Note that you must have installed a _runner_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Installation

1. Add the package to your project:

```shell
npm install @fabernovel/heart-lighthouse
```

2. In the project root folder, create a `.env` file with the following environment variable:

```dotenv
LIGHTHOUSE_API_TOKEN=My_Lighthouse_Api_Token
```

# Usage
