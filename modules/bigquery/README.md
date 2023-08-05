# Description

_Heart BigQuery_ is a _listener_ module of _Heart_, which reacts at the end of an analysis by storing the results into a table of a _[Google BigQuery](https://cloud.google.com/bigquery/)_ instance.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_

    ```bash
    npm install @fabernovel/heart-bigquery @fabernovel/heart-greenit
    ```

    If you are using Yarn, npm < 7 or PNPM < 8 as package manager, you also have to install _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ (which is automatically installed if you have more recent versions):

    ```bash
    npm install @fabernovel/heart-cli
    ```

2. In the project root folder, create a `.env` file with the [_Google Service accounts_](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) credentials (you can use [Code Beautify](https://codebeautify.org/remove-extra-spaces) to remove whitespaces)

    ```dotenv
    HEART_BIGQUERY_GOOGLE_APPLICATION_CREDENTIALS={"type": "service_account","project_id": "","private_key_id": "","private_key": "","client_email": "","client_id": "","auth_uri": "","token_uri": "","auth_provider_x509_cert_url": "","client_x509_cert_url": ""}
    ```

3. Start an analysis

    ```bash
    npx heart greenit --config '{"url":"https://www.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart greenit --file configuration.json
    ```

    Once the analysis is done, the _heart_ table of the _analysis_ dataset is populated with the results.

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
