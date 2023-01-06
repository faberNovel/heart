# Description

_Heart_ is a modular command-line tool written in Node.js that centralize the analyse of webpages using different third-party services, like [_Google Lighthouse_](https://pagespeed.web.dev/), [_ecoIndex_](https://www.ecoindex.fr/) or [_Mozilla Observatory_](https://observatory.mozilla.org/).

Moreover, it can also store the results of these analysis and notify you when they are over.

# Usage

>>>
I want to:
- analyze https://heart.fabernovel.com/ using the _Google Lighthouse_ service.
- be notified on the `#heart` Slack channel when the analysis is over.
- check if the score reach a minimum of 85.
>>>

## Standalone

1. Install the modules
    
    `npm install @fabernovel/heart-cli @fabernovel/heart-lighthouse @fabernovel/heart-slack`

2. Configure the Slack module
    
    `echo SLACK_API_TOKEN=My_Slack_Api_Token >> .env`

3. Analyze the URL

    `npx heart lighthouse --inline '{"url":"https://heart.fabernovel.com/"}' --threshold 85`

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

# Design

_Heart_ has been designed to be as light as possible, which explains its modular structure: you only install what you need.

## Modules types


To do so, _Heart_ is divided in 3 types of modules:

| Type | Mission | Example |
| ------ | ------ | ------ |
| Runner | Starts an analysis | using a CLI or an API |
| Analysis | Analyses URLs using third-party services | using _Mozilla Observatory_ |
| Listener | Do thing with the results of the analysis | send them into a _Slack_ channel |

The minimum setup you need to run _Heart_, is to have the _Heart CLI_ _runner_ module and a single _analysis_ module.

## Modules list

### Runner

_Heart CLI_ is the only _Runner_ module required.

| Name | Purpose | |
| ------ | ------ | ------ |
| Heart API | Exposes an HTTP API that starts an analysis when it is requested | [![npm install @fabernovel/heart-api](https://nodei.co/npm/@fabernovel/heart-api.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-api) |
| Heart CLI | Control the other modules by using a CLI | [![npm install @fabernovel/heart-cli](https://nodei.co/npm/@fabernovel/heart-cli.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-cli) |

### Analysis

Only one _Analysis_ module is required, regardless of which one.

| Name | Purpose | |
| ------ | ------ | ------ |
| Heart Dareboost | Analyses URLs with [Dareboost](https://www.dareboost.com/en) | [![npm install @fabernovel/heart-dareboost](https://nodei.co/npm/@fabernovel/heart-dareboost.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-dareboost) |
| Heart GreenIT | Analyzes URLs with [GreenIT Analysis](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=en) | [![npm install @fabernovel/heart-greenit](https://nodei.co/npm/@fabernovel/heart-greenit.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-greenit) |
| Heart Lighthouse | Analyses URLs with [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) | [![npm install @fabernovel/heart-lighthouse](https://nodei.co/npm/@fabernovel/heart-lighthouse.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-lighthouse) |
| Heart Observatory | Analyses URLs with [Mozilla Observatory](https://observatory.mozilla.org/) | [![npm install @fabernovel/heart-observatory](https://nodei.co/npm/@fabernovel/heart-observatory.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-observatory) |
| Heart SSL Labs Server | Analyses URLs with [Qualys SSL Labs Server](https://www.ssllabs.com/ssltest/) | [![npm install @fabernovel/heart-ssllabs-server](https://nodei.co/npm/@fabernovel/heart-ssllabs-server.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-ssllabs-server) |

### Listener

All _Listener_ modules are optional.

| Name | Purpose | |
| ------ | ------ | ------ |
| Heart BigQuery | Stores the results of the analysis into a [Google BigQuery](https://cloud.google.com/bigquery) table | [![npm install @fabernovel/heart-bigquery](https://nodei.co/npm/@fabernovel/heart-bigquery.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-bigquery)
| Heart Slack | Sends the results of the analysis to a [Slack](https://slack.com) channel | [![npm install @fabernovel/heart-slack](https://nodei.co/npm/@fabernovel/heart-slack.png?mini=true)](https://www.npmjs.com/package/@fabernovel/heart-slack) |
