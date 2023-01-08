# Description

_Heart GreenIT_ is an _analysis_ module of _Heart_, which analyses URLs with _[GreenIT](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad)_.

Read more about [the description and design of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Usage

## Standalone

1. Install the package and _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_

    ```bash
    npm install @fabernovel/heart-cli @fabernovel/heart-greenit
    ```

2. Start an analysis

    ```bash
    npx heart greenit --inline '{"url":"https://www.fabernovel.com/"}'
    ```

    OR 

    ```bash
    npx heart greenit --file configuration.json
    ```

    The analysis configuration follows the JSON format and has the following keys:

    ```json
    {
        "url": "https://www.fabernovel.com/",
        // optional - default: 3000
        "timeout": 1000,
        // optional - default: 2
        "retry": 2,
        // optional - default: "desktop"
        // possible values: "desktop", "galaxyS9", "galaxyS20", "iPhone8", "iPhone8Plus", "iPhoneX", "iPad"
        "device": "galaxyS20"
    }
    ```

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

# Disclaimer

The LCA values used by GreenIT to evaluate environmental impacts are not under free license - &copy; Frédéric Bordage

Please also refer to the mentions provided in the code files for specifics on the IP regime.
