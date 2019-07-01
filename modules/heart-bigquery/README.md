# Description

_Heart BigQuery_ is a _storage_ module of _Heart_, which stores the results of the analysis into a _[Google BigQuery](https://cloud.google.com/bigquery/)_ table.

Note that you must have installed a _runner_ module and an _analysis_ one too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/heart-dev/wikis/What-is-Heart).

# Installation

1. Add the package to your project:

    ```shell
    npm install @fabernovel/heart-bigquery
    ```

2. Add the [_Google Service accounts_](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) credentials as environment variable (you can use [Code Beautify](https://codebeautify.org/remove-extra-spaces) to remove whitespaces):

    ```shell
    GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","project_id":"","private_key_id":"","private_key":"","client_email":"","client_id":"","auth_uri":"","token_uri":"","auth_provider_x509_cert_url":"","client_x509_cert_url":""}'
    ```

# Usage

Start an analysis using one of your _runner_, and watch your _Google BigQuery_ table populated with the results.

# Notes

It is planned for a future release that you can configure the _Google BigQuery_ dataset name, location and table name. But for the moment:

* BigQuery default settings are used for the location
* _heart_ is the name of the dataset
* _analysis_ is the name of the table
