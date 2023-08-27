# Description

_Heart Slack_ is a _listener_ module of _Heart_, which reacts to the end of an analysis by sending the results to a _[Slack](https://slack.com)_ channel.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_

    ```bash
    npm install @fabernovel/heart-greenit @fabernovel/heart-slack
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. In the project root folder, create a `.env` file with the Slack Access token

    ```dotenv
    HEART_SLACK_ACCESS_TOKEN=My_Slack_Access_Token
    ```

3. [Optional] Customize the Slack channel

    By default the `heart` channel is used, but you can customize it by adding the `HEART_SLACK_CHANNEL_ID` variable to your .env file:
    ```dotenv
    HEART_SLACK_CHANNEL_ID=my-custom-channel
    ```

    Note that the channel identifier must follows the format and rules indicated in [the Slack API documentation](https://api.slack.com/methods/chat.postMessage#channels).

4. Start an analysis

    ```bash
    npx heart greenit --config '{"url":"https://www.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart greenit --config config.json
    ```

    Once the analysis is done, a notification is sent to your _Slack_ channel.

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
