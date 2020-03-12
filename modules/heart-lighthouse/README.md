# Heart Lighthouse

_Heart Lighthouse_ is an _analysis_ module of _Heart_, which analyses URLs with _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_.

Read more about [the purpose, design and general installation of _Heart_](https://www.fabernovel.com/en/clients/cases/heart-a-tool-for-automating-web-quality-metrics).

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-lighthouse
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it. It is a peer-dependency of `heart-lighthouse`

    ```shell
    npm install @fabernovel/heart-cli
    ```

# Usage

## Analysis setup

The analysis setup must use the JSON format with a `url` key.

## Simple

Using _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_, to start a _Google Lighthouse_ analysis of https://www.fabernovel.com looks like this:

```shell
npx heart lighthouse --inline '{"url":"https://heart.fabernovel.com"}'
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
