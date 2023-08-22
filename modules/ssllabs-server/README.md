# Description

_Heart SSL Labs Server_ is an _analysis_ module of _Heart_, which analyses URLs with _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_.

Read more about [the purpose, design and general installation of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @fabernovel/heart-ssllabs-server
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. Start an analysis

    ```bash
    npx heart ssllabs-server --config '{"host":"heart.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart ssllabs-server --config config.json
    ```

    The analysis configuration follows the JSON format and  the [Invoke assessment and check progress API documentation](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
