# Description

_Heart BigQuery_ is a _listener_ module of _Heart_, which reacts to the end of an analysis by storing the results into a _[Google BigQuery](https://cloud.google.com/bigquery/)_ table.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Package manager

In the following sections, every examples are using NPM as package manager, but you can use any other you prefer: Yarn, pnpm...

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-bigquery
    ```

2. Add _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ if you have not already installed it

    ```shell
    npm install @fabernovel/heart-cli
    ```

3. In the project root folder, create a `.env` file with the [_Google Service accounts_](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) credentials (you can use [Code Beautify](https://codebeautify.org/remove-extra-spaces) to remove whitespaces):

    ```dotenv
    GOOGLE_APPLICATION_CREDENTIALS={"type": "service_account","project_id": "","private_key_id": "","private_key": "","client_email": "","client_id": "","auth_uri": "","token_uri": "","auth_provider_x509_cert_url": "","client_x509_cert_url": ""}
    ```

# Usage

Start an analysis using one of your _runner_, and watch your _Google BigQuery_ table populated with the results.

# Notes

It is planned for a future release that you can configure the _Google BigQuery_ dataset name, location and table name. But for the moment:

* BigQuery default settings are used for the location
* _heart_ is the name of the dataset
* _analysis_ is the name of the table
