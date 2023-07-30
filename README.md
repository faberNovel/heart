<p align="center">
    <img alt="Violet square with rounded corners, featuring a heart in the form of a cloud of dots. Some of the dots are interconnected" src="./docs/images/heart.png" width="128">
</p>

<p align="center">A command-line tool to industrialize web quality measurement.</p>

# Description

Heart is a tool that centralize the use of famous web quality measurement services ([_Google Lighthouse_](https://pagespeed.web.dev/), [_GreenIT Analysis_](https://www.ecoindex.fr/) or [_Mozilla Observatory_](https://observatory.mozilla.org/)) in a unique CLI

With his modular approach, it makes easy to process the analysis results into a database to track metrics over time, or send them into a communication tool like Slack.

Moreover, the command-line interface allows a smooth integration into a CI/CD chain, particularly on GitHub where you can make use of [the dedicated GitHub Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

# Usage

I want to:
- analyze https://heart.fabernovel.com/ using the _Google Lighthouse_ service.
- get the main metrics and advices on a `heart` Slack channel when the analysis is over.
- check that the page grade reaches a minimum of 85 over 100.

## Manual

1. Install the packages
    
    ```bash
    npm install @fabernovel/heart-lighthouse @fabernovel/heart-slack
    ```

2. Configure the Slack module
    
    ```bash
    echo HEART_SLACK_API_TOKEN=My_Slack_Api_Token >> .env
    ```

3. Start the analysis

    ```bash
    npx heart lighthouse --config '{"url":"https://heart.fabernovel.com/"}' --threshold 85
    ```

Here is an extract of what the Slack notification looks like:

![Analyzed URL, overall grade over 100, several metrics like Speed Index, First Contentful Paint and advices for improvements](./docs/images/heart-slack.png)

## Automated with GitHub Action

If you're using GitHub, you can simplify the integration of Heart in your CI scripts by using the [GitHub Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

# Design

_Heart_ has been designed to be as light as possible, which explains its modular approach: you only install what you need.

To do so, _Heart_ is divided in 3 types of modules.

## Modules types

| Type | Mission | Example |
| ------ | ------ | ------ |
| Runner | Starts an analysis | using the CLI or the HTTP API |
| Analysis | Analyzes URLs using third-party services | using _GreenIT Analysis_ |
| Listener | Do thing with the results of the analysis | send them into a _Slack_ channel |

**The minimum setup you need to run _Heart_, is to have the _Heart CLI_ _runner_ module and a single _analysis_ module.**

## Modules list

| Name | Type | Purpose | |
| ------ | ------ | ------ | ------ |
| Heart API | Runner | Exposes an HTTP API that starts an analysis when it is requested | [![](https://img.shields.io/npm/v/@fabernovel/heart-api/latest?label=%40fabernovel%2Fheart-api)](https://www.npmjs.com/package/@fabernovel/heart-api "View Heart API on npmjs.com") |
| Heart CLI | Runner | Control the other modules by using a CLI | [![](https://img.shields.io/npm/v/@fabernovel/heart-cli/latest?label=%40fabernovel%2Fheart-cli)](https://www.npmjs.com/package/@fabernovel/heart-cli "View Heart CLI on npmjs.com") |
| Heart GreenIT | Analysis | Analyzes URLs with [GreenIT Analysis](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=en) | [![](https://img.shields.io/npm/v/@fabernovel/heart-greenit/latest?label=%40fabernovel%2Fheart-greenit)](https://www.npmjs.com/package/@fabernovel/heart-greenit "View Heart GreenIT on npmjs.com") |
| Heart Lighthouse | Analysis | Analyzes URLs with [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) | [![](https://img.shields.io/npm/v/@fabernovel/heart-lighthouse/latest?label=%40fabernovel%2Fheart-lighthouse)](https://www.npmjs.com/package/@fabernovel/heart-lighthouse "View Heart Lighthouse on npmjs.com") |
| Heart Observatory | Analysis | Analyzes URLs with [Mozilla Observatory](https://observatory.mozilla.org/) | [![](https://img.shields.io/npm/v/@fabernovel/heart-observatory/latest?label=%40fabernovel%2Fheart-observatory)](https://www.npmjs.com/package/@fabernovel/heart-observatory "View Heart Observatory on npmjs.com") |
| Heart SSL Labs Server | Analysis | Analyzes URLs with [Qualys SSL Labs Server](https://www.ssllabs.com/ssltest/) | [![](https://img.shields.io/npm/v/@fabernovel/heart-ssllabs-server/latest?label=%40fabernovel%2Fheart-ssllabs-server)](https://www.npmjs.com/package/@fabernovel/heart-ssllabs-server "View Heart SSL Labs Server on npmjs.com") |
| Heart BigQuery | Listener | Stores the results of the analysis into a [Google BigQuery](https://cloud.google.com/bigquery) table | [![](https://img.shields.io/npm/v/@fabernovel/heart-bigquery/latest?label=%40fabernovel%2Fheart-bigquery)](https://www.npmjs.com/package/@fabernovel/heart-bigquery "View Heart BigQuery on npmjs.com")
| Heart MySQL | Listener | Stores the results of the analysis into a [MySQL](https://www.mysql.com) database | [![](https://img.shields.io/npm/v/@fabernovel/heart-mysql/latest?label=%40fabernovel%2Fheart-mysql)](https://www.npmjs.com/package/@fabernovel/heart-mysql "View Heart MySQL on npmjs.com")
| Heart Slack | Listener | Sends the results of the analysis to a [Slack](https://slack.com) channel | [![](https://img.shields.io/npm/v/@fabernovel/heart-slack/latest?label=%40fabernovel%2Fheart-slack)](https://www.npmjs.com/package/@fabernovel/heart-slack "View Heart Slack on npmjs.com") |
