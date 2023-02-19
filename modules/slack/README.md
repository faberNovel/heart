# Description

_Heart Slack_ is a _listener_ module of _Heart_, which reacts to the end of an analysis by sending the results to a _[Slack](https://slack.com)_ channel.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://gitlab.com/fabernovel/heart/-/blob/master/README.md).


# Usage

## Standalone

1. Install the package, _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_

    ```bash
    npm install @fabernovel/heart-cli @fabernovel/heart-greenit @fabernovel/heart-slack
    ```

2. In the project root folder, create a `.env` file with the Slack API token

    ```dotenv
    SLACK_API_TOKEN=My_Slack_Api_Token
    ```

3. [Optional] Customize the Slack channel

    By default the `#heart` channel is used, but you can customize it by adding the `SLACK_CHANNEL_ID` variable to your .env file:
    ```dotenv
    SLACK_CHANNEL_ID=#my-custom-channel
    ```

    Note that the channel identifier must follows the format and rules indicated in [the Slack API documentation](https://api.slack.com/methods/chat.postMessage#channels).

4. Start an analysis

    ```bash
    npx heart greenit --inline '{"url":"https://www.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart greenit --file configuration.json
    ```

    Once the analysis is done, a notification is sent to your _Slack_ channel.

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
