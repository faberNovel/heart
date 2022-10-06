# Heart Lighthouse

_Heart Lighthouse_ is an _analysis_ module of _Heart_, which analyses URLs with _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_.

Read more about [the purpose, design and general installation of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).

# Installation

1. Install _Google Chrome_, as _Google Lighthouse_ relies on it to analyze a web page

2. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-lighthouse
    ```

3. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it. It is a peer-dependency of `heart-lighthouse`

    ```shell
    npm install @fabernovel/heart-cli
    ```

# Usage

## Analysis setup

The analysis setup must use the JSON format with a `url` key.

## Simple

> Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_
>
> You want to analyse the https://heart.fabernovel.com URL and check that the rating is at least 90

```shell
npx heart lighthouse --inline '{"url":"https://heart.fabernovel.com"}' --threshold 90
```

## Advanced

You can change the default _Google Lighthouse_ configuration with the `config` key. Populate it with [the values described in their documentation](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md#lighthouse-configuration):

`lighthouse.json`:
```json
{
  "url": "https://heart.fabernovel.com",
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

```shell
npx heart lighthouse --file lighthouse.json
```
