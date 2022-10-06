# Purpose

The main feature of _Heart_ is to analyse URLs using different third-party services, like _Mozilla Observatory_ or _Dareboost_.

Moreover, it can also store the results of these analysis and notify you when they are over.

# Design

One important concept of _Heart_ is to be modular: you only install what you need.

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

| Name | Purpose | NPM registry URL | Code coverage |
| ------ | ------ | ------ | ------ |
| Heart API | Exposes an HTTP API that starts an analysis when it is requested | https://www.npmjs.com/package/@fabernovel/heart-api | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+API) |
| Heart CLI | Control the other modules by using a CLI | https://www.npmjs.com/package/@fabernovel/heart-cli | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+CLI) |

### Analysis

Only one _Analysis_ module is required, regardless of which one.

| Name | Purpose | NPM registry URL | Code coverage |
| ------ | ------ | ------ | ------ |
| Heart Dareboost | Analyses URLs with [Dareboost](https://www.dareboost.com/en) | https://www.npmjs.com/package/@fabernovel/heart-dareboost | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+Dareboost) |
| Heart Lighthouse | Analyses URLs with [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) | https://www.npmjs.com/package/@fabernovel/heart-lighthouse | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+Lighthouse) |
| Heart Observatory | Analyses URLs with [Mozilla Observatory](https://observatory.mozilla.org/) | https://www.npmjs.com/package/@fabernovel/heart-observatory | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+Observatory) |
| Heart SSL Labs Server | Analyses URLs with [Qualys SSL Labs Server](https://www.ssllabs.com/ssltest/) | https://www.npmjs.com/package/@fabernovel/heart-ssllabs-server | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+SSL+Labs+Server) |
| Heart GreenIT | Analyzes URLs with [GreenIT Analysis](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=en) | https://www.npmjs.com/package/@fabernovel/heart-greenit | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+GreenIT) |

### Listener

All _Listener_ modules are optional.

| Name | Purpose | NPM registry URL | Code coverage |
| ------ | ------ | ------ | ------ |
| Heart BigQuery | Stores the results of the analysis into a [Google BigQuery](https://cloud.google.com/bigquery) table | https://www.npmjs.com/package/@fabernovel/heart-bigquery | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+BigQuery) |
| Heart Slack | Sends the results of the analysis to a [Slack](https://slack.com) channel | https://www.npmjs.com/package/@fabernovel/heart-slack | ![coverage](https://gitlab.com/fabernovel/heart/badges/master/coverage.svg?job=%F0%9F%9A%A6+Coverage%3A+Heart+Slack) |

## Configuration

Each module has its own configuration, and it can be setup and changed using environment variables (see the _Installation_ section below).

# Installation

Now that you know every concept of _Heart_, let's the installation begin!

## General installation

1. Install an _analysis_ module and _Heart CLI_

2. [Optional] Install any other module you want: another _runner_ module, a _listener_ module...

3. Configure the modules you have just installed (the configuration of each module is detailed in its README file)

4. Start your URLs analysis using one of your runner (the use of each runner is detailed in its README file) :tada: 

## Example

>>>
I want to analyse URLs using the _Dareboost_ service.

I want to start the analysis from the CLI.

I want to be notified on my Slack channel when the analysis are over.

I want to reach a minimum score of 85.
>>>

Following the general installation steps, here is a list of the operations you must perform:

1. `npm install @fabernovel/heart-dareboost @fabernovel/heart-cli`

2. `npm install @fabernovel/heart-slack`

3. `echo DAREBOOST_API_TOKEN=My_Dareboost_Api_Token >> .env`
   
   `echo SLACK_API_TOKEN=My_Slack_Api_Token >> .env`
   
   `echo SLACK_CHANNEL_ID=#my-slack-channel >> .env`

4. `npx heart dareboost --inline '{"url":"https://about.gitlab.com/"}' --threshold 85`

Note that step 3 shows an example of setting up environment variables using a `.env` file. This is a convenient way offered by _Heart_ to set them, but you can define them in any way you want.
