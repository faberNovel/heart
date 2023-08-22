# Contributing to _Heart_

Hi 👋 and welcome to the contributing guide of _Heart_.

We are going to walk through the different steps that will lead you to contribute to the project, from reporting an issue to suggesting new features.

To make the _Heart_ accessible to most users, everything is written in english, and you are invited to use this language if possible.

## Make sure that your contribution does not already exist

Before making a new contribution, please check [the issues](https://github.com/faberNovel/heart/issues) and the [pull requests](https://github.com/faberNovel/heart/pulls) as you might find out that you don't need to create one.

## Reporting Bugs

[Create a new issue](https://github.com/faberNovel/heart/issues/new/choose) and include as many details as possible, such as:
* the version of Node.js
* the list of _Heart_ modules installed
* the differents steps that lead to the bug
* ...

## Suggesting enhancements

### Before submitting an enhancement suggestion

1. Check if there's already a package which provides that enhancement.
2. Check that there is an issue related to this enhancement. If not, please create it.

### Create a _Pull Request_

1. Create a branch for your enhancement from the `main` branch and push it to the remote
2. [Create a Pull Request from the GitHub interface](https://github.com/faberNovel/heart/compare) and select your branch

### [Setup your local environment](docs/SETUP_LOCAL_ENVIRONMENT.md)

### Code your enhancements

1. Checkout the newly created branch
2. Code your enhancements. If your enhancement is about creating a new module, you will find some help with [the dedicated documentation](docs/CREATE_NEW_MODULE.md).

### Test your enhancements

#### End-user testing

You can test a close-to-end-user installation in the `test` directory.

To do so, you have to:

1. Go to the directory and create a `.env` file in this directory by copying it from `.env.tpl`:

    ```shell
    cd test && cp .env.tpl .env
    ````

2. Populate the `.env` file with the environment variables needed by all the modules.

3. Install the packages:

    ```shell
    rush-pnpm install
    ````

4. Starts an analysis using the CLI. You can list the available analysis by using:

    ```shell
    rush-pnpm exec heart -h
    ```

    Example of a CLI command using the _Heart Lighthouse_ module:

    ```shell
    rush-pnpm exec heart lighthouse --config '{"url": "https://heart.fabernovel.com/"}'
    ```

### [Provide a changelog](docs/PROVIDE_CHANGELOG.md)

### Submit your enhancements

Now that your enhancements work perfectly and that you provide a changelog, it is time to submit for review:

1. Push your local changes to the remote
2. Using the GitHub interface, check that every check are sucessful
    
    If not, you have to open the pipeline and see the details of the actions that failed, update your code and start the submitting process again.

The merging operation will then be done by a core team member.
