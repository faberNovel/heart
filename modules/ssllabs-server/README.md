# Description

_Heart SSL Labs Server_ is an _analysis_ module of _Heart_, which analyses URLs with _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_.

Read more about [the purpose, design and general installation of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package and _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_

    ```bash
    npm install @fabernovel/heart-cli @fabernovel/heart-ssllabs-server
    ```

2. Start an analysis

    ```bash
    npx heart ssllabs-server --config '{"host":"heart.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart ssllabs-server --file configuration.json
    ```

    The analysis configuration follows the JSON format and  the [Invoke assessment and check progress API documentation](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
