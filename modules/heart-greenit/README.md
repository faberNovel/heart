# Heart GreenIT

_Heart GreenIT_ is an _analysis_ module of _Heart_, which analyses URLs with _[GreenIT](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad)_.

Read more about [the purpose, design and general installation of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-greenit
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

# Usage

## Analysis setup

The analysis setup must use the JSON format with the following keys:

```json
{
    "url": "https://www.heart.fabernovel.com/",
    // optional - default: 3000
    "timeout": 1000,
    // optional - default: 2
    "retry": 2,
    // optional - default: "desktop"
    // possible values: "desktop", "galaxyS9", "galaxyS20", "iPhone8", "iPhone8Plus", "iPhoneX", "iPad"
    "device": "mobile"
}
```

## Example

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, starting a _GreenIT_ analysis of https://heart.fabernovel.com could look like that:

```shell
npx heart greenit --inline '{"url":"https://heart.fabernovel.com"}'
```

# Disclaimer

The LCA values used by GreenIT to evaluate environmental impacts are not under free license - &copy; Frédéric Bordage

Please also refer to the mentions provided in the code files for specifics on the IP regime.