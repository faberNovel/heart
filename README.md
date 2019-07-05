# Purpose

The main feature of _Heart_ is to analyse URLs using different third-party services, like _Mozilla Observatory_ or _Dareboost_.

Moreover, it can also store the results of these analysis and notify you when they are over.

# Design

One important concept of _Heart_ is to be modular: you only install what you need.

## Modules types

To do so, _Heart_ is divided in 4 types of modules:

| Type | Mission | Example
| ------ | ------ | ------ |
| Runner | Starts an analysis | using a CLI or an API |
| Analysis | Analyses URLs using third-party services | using _Mozilla Observatory_ |
| Storage | Stores the results of the analysis | into a _Google BigQuery_ table |
| Notification | Sends the results of the analysis | into a _Slack_ channel |

Consequently, the minimum setup you need to run _Heart_, is to have a single _runner_ module and a single _analysis_ module.

## Modules list

| Type | Name | Purpose | NPM registry URL |
| ------ | ------ | ------ | ------ |
| Runner | Heart API | Exposes an API that starts an analysis when it is requested | https://www.npmjs.com/package/@fabernovel/heart-api |
| Runner | Heart CLI | Starts an analysis by using a CLI | https://www.npmjs.com/package/@fabernovel/heart-cli
| Analysis | Heart Dareboost | Analyses URLs by using the [Dareboost](https://www.dareboost.com/en) service | https://www.npmjs.com/package/@fabernovel/heart-dareboost |
| Analysis | Heart Observatory | Analyses URLs by using the [Mozilla Observatory](https://observatory.mozilla.org/) service | https://www.npmjs.com/package/@fabernovel/heart-observatory |
| Analysis | Heart SSL Labs Server | Analyses URLs by using the [Qualys SSL Labs Server](https://www.ssllabs.com/ssltest/) service | https://www.npmjs.com/package/@fabernovel/heart-ssllabs-server |
| Storage | Heart BigQuery | Stores the results of the analysis into a [Google BigQuery](https://cloud.google.com/bigquery) table | https://www.npmjs.com/package/@fabernovel/heart-bigquery |
| Notification | Heart Slack | Sends the results of the analysis to a [Slack](https://slack.com) channel | https://www.npmjs.com/package/@fabernovel/heart-slack |

## Configuration

Each module has its own configuration, and it can be setup and changed using environment variables (see the _Installation_ section below).

# Installation

Now that you know every concept of _Heart_, let's the installation begin!

## General installation

1. Install a _runner_ type module 

2. Install an _analysis_ type module 

3. [Optional] Install any other module you want: another runner module, a storage module...

4. Configure the modules you have just installed (the configuration of each module is detailed in its README file)

5. Start your URLs analysis using one of your runner (the use of each runner is detailed in its README file) :tada: 

## Example

>>>
I want to start the analysis from the CLI.

I want to analyse URLs using the _Dareboost_ service.

I want to be notified on my Slack channel when the analysis are over.
>>>

Following the general installation steps, here is a list of the operations you must perform:

1. `npm install @fabernovel/heart-cli`

2. `npm install @fabernovel/heart-dareboost`

3. `npm install @fabernovel/heart-slack`

4. `DAREBOOST_API_TOKEN=My_Dareboost_Api_Token`[^2]
   
   `SLACK_API_TOKEN=My_Slack_Api_Token`
   
   `SLACK_CHANNEL_ID=A1BC23D4E`

5. `npx heart /dareboost '{"url":"https://about.gitlab.com/"}'`

Note that step 4 shows an example of setting up environment variables. How you register them is up to you.