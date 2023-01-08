# Description

_Heart CLI_ is the control module of _Heart_. It allows every other module to work together, and is able to control the _Heart API_ and the _analysis_ modules.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. Displays the list of commands you can use, regarding your installed modules

    ```bash
    npx heart --help
    ```

  The list of available commands change each time you install an _analysis_ module or _Heart API_.

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
