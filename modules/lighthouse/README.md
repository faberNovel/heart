# Description

_Heart Lighthouse_ is an _analysis_ module of _Heart_, which analyses URLs with _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_.

Read more about [the description and design of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @fabernovel/heart-lighthouse
    ```

    If you are using Yarn, npm < 7 or PNPM < 8 as package manager, you also have to install _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ (which is automatically installed if you have more recent versions):

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. Start an analysis

    ```bash
    npx heart lighthouse --config '{"url":"https://heart.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart lighthouse --config desktop.json
    ```

    The analysis configuration follows the JSON format and has the following keys:

    ```jsonc
    {
        "url": "https://www.fabernovel.com/",
        // optional - customize Google Lighthouse
        // see https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md#lighthouse-configuration
        "config": {
          "extends": "lighthouse:default",
          "settings": {
            "onlyAudits": [
              "first-meaningful-paint",
              "speed-index",
              "first-cpu-idle",
              "interactive"
            ]
          }
        }
    }
    ```

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
