# Description

_Heart Slack_ is a _notification_ module of _Heart_, which sends the results of an analysis to a _[Slack](https://slack.com)_ channel.

Note that you must have installed a _runner_ module and an _analysis_ one too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/heart-dev/wikis/What-is-Heart).

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-slack
    ```

2. Add the Slack API token and channel identifier to the environment variables:

    ```shell
    SLACK_API_TOKEN=My_Slack_Api_Token
    SLACK_CHANNEL_ID=#heart
    ```

    Note that the channel identifier must follows the format and rules indicated in [the Slack API documentation](https://api.slack.com/methods/chat.postMessage#channels).

# Usage

Start an analysis using one of your _runner_, and watch your _Slack_ channel being updated with the results.
