<p align="center">
    <img alt="Violet square with rounded corners, featuring a heart in the form of a cloud of dots. Some of the dots are interconnected" src="./docs/images/heart.png" width="128">
</p>

<p align="center">A command-line tool to industrialize web quality measurement.</p>

[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-cli?logo=npm "List Heart packages on npmjs.com")](https://www.npmjs.com/search?q=%40fabernovel%2Fheart)
[![license badge](https://img.shields.io/github/license/faberNovel/heart)](./LICENSE.md "Read the licence")
[![codecov](https://codecov.io/gh/faberNovel/heart/branch/main/graph/badge.svg?token=GN6PJTCDH9)](https://codecov.io/gh/faberNovel/heart "View coverage details")
[![Known Vulnerabilities](https://snyk.io/test/github/faberNovel/heart/badge.svg?targetFile=modules/cli/package.json)](https://snyk.io/test/github/faberNovel/heart?targetFile=modules/cli/package.json "View known vulnerabilities")

# Description

Heart is a tool that centralize the use of famous web quality measurement services ([_Google Lighthouse_](https://pagespeed.web.dev/), [_GreenIT Analysis_](https://www.ecoindex.fr/) or [_Mozilla Observatory_](https://observatory.mozilla.org/)) in a unique CLI.

With his modular approach, it makes easy to process the analysis results into a database to track metrics over time, or send them into a communication tool like _Slack_.

Moreover the command-line interface allows a smooth integration into a CI/CD chain.

# Example of use

Exemple scenario:
- analyze <https://heart.fabernovel.com/> using the _Google Lighthouse_ service.
- receive the main metrics and advices on a `heart` Slack channel when the analysis is over.
- store the results in a _MySQL_ database.

## Manual, with NPM packages

1. Install the packages
    
    ```bash
    npm install @fabernovel/heart-lighthouse @fabernovel/heart-slack @fabernovel/heart-mysql
    ```

2. Set the credentials for Slack (API key) and MySQL (database URL)
    
    ```bash
    echo HEART_SLACK_API_TOKEN=xoxb-rest-of-token >> .env
    echo HEART_MYSQL_DATABASE_URL=login:password@127.0.0.1:3306 >> .env
    ```

3. Create a Slack channel named `heart` and a database with the same name.

4. Start the analysis

    ```bash
    npx heart lighthouse --config '{"url":"https://heart.fabernovel.com/"}'
    ```

Once the analysis is over, you will receive a Slack notification to quickly identify what can be improved:

![Analyzed URL, overall grade over 100, several metrics like Speed Index, First Contentful Paint and advices for improvements](./docs/images/heart-slack.png)

And the results will be stored in a `report` table, which you can exploit with tools like _Grafana_:

![Analyzed URL, overall grade over 100, several metrics like Speed Index, First Contentful Paint and advices for improvements](./docs/images/heart-mysql.png)

For more options, have a look at the help by using `npx heart -h`

## Packaged, with the Docker image

Heart is also available as a [Docker image](https://hub.docker.com/r/fabernovel/heart).

With the example scenario given previously, the Docker image is used as follow:

```shell
docker run --rm\
    --env HEART_SLACK_API_TOKEN=xoxb-rest-of-token\
    --env HEART_MYSQL_DATABASE_URL=login:password@127.0.0.1:3306\
    fabernovel/heart:latest\
    lighthouse --config '{"url":"https://heart.fabernovel.com"}' --only-listeners=mysql,slack
```

## Automated, with the GitHub Action

If you're using GitHub, you can simplify the integration of Heart in your CI scripts by using the [GitHub Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

With the example scenario given previously, the GitHub Action is used as follow:

```yaml
- uses: faberNovel/heart-action@v4
  with:
    analysis_service: lighthouse
    listener_services_only: mysql,slack
    mysql_database_url: ${{ secrets.MYSQL_DATABASE_URL }}
    slack_api_token: ${{ secrets.SLACK_API_TOKEN }}
```

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
| Heart MySQL | Listener | Stores the results of the analysis into a [MySQL](https://www.mysql.com) database | [![](https://img.shields.io/npm/v/@fabernovel/heart-mysql/latest?label=%40fabernovel%2Fheart-mysql)](https://www.npmjs.com/package/@fabernovel/heart-mysql "View Heart MySQL on npmjs.com")
| Heart Slack | Listener | Sends the results of the analysis to a [Slack](https://slack.com) channel | [![](https://img.shields.io/npm/v/@fabernovel/heart-slack/latest?label=%40fabernovel%2Fheart-slack)](https://www.npmjs.com/package/@fabernovel/heart-slack "View Heart Slack on npmjs.com") |
