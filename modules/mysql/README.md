# Heart MySQL

_Heart MySQL_ is a _listener_ module of _Heart_, which reacts to the end of an analysis by storing the results of an analysis in a MySQL database of your choice.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Heart_.

Read more about [the description and design of _Heart_](https://github.com/faberNovel/heart#readme).

# Usage

## Standalone

1. Install the package, _[Heart CLI](https://www.npmjs.com/package/@fabernovel/heart-cli)_ and an _analysis_ module, for example _[Heart GreenIT](https://www.npmjs.com/package/@fabernovel/heart-greenit)_

    ```bash
    npm install @fabernovel/heart-cli @fabernovel/heart-greenit @fabernovel/heart-slack
    ```

2. In the project root folder, create a `.env` file with the database connection information set as a URL

    ```dotenv
    HEART_MYSQL_URL=mysql://root@127.0.0.1:3306
    ```

3. Start an analysis

    ```bash
    npx heart greenit --config '{"url":"https://www.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart greenit --file configuration.json
    ```

    Once the analysis is done, the results are stored in your _MySQL_ database, mainly in the `report` table.

## Github Action

If you're using Github, you can simplify the integration of Heart in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
