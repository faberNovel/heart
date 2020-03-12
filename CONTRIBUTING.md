# Contributing to _Heart_

Hi 👋 and welcome to the contributing guide of _Heart_.

We are going to walk through the different steps that will lead you to contribute to the project, from reporting an issue to suggesting new features.

To make the _Heart_ accessible to most users, everything is written in english, and you are invited to use this language if possible.

## Make sure that your contribution does not already exist

Before making a new contribution, please check [the issues](https://gitlab.com/fabernovel/heart/-/boards) and the [merge requests](https://gitlab.com/fabernovel/heart/-/merge_requests) as you might find out that you don't need to create one.

## Reporting Bugs

[Create a new issue](https://gitlab.com/fabernovel/heart/-/issues/new) and include as many details as possible, such as:
* the version of Node.js
* the list of _Heart_ modules installed
* the differents steps that lead to the bug
* ...

## Suggesting enhancements

### Before submitting an enhancement suggestion

1. Check if there's already a package which provides that enhancement.
2. Check that there is an issue related to this enhancement. If not, please create it

### Create a _Merge Request_ from the issue

Using the _GitLab_ interface:

1. Open the issue related to your enhancement
2. Click on _Create merge request_ to create a new branch, a new merge request and link them both

The _Merge Request_ is created with the _WIP:_ prefix, which indicates that the enhancements are still under construction

### Setup your local environment

#### Install the requirements

Make sure you're using Node.js version 10 (>= 10 and <11 exactly)

_Heart_ handle every modules in a single repository that is managed with [Rush](https://rushjs.io/) and [pnpm](https://pnpm.js.org/).

So make sure you have them both installed on your computer before you begin:

```shell
npm install -g @microsoft/rush pnpm
```

#### Clone the repository

```shell
git clone git@gitlab.com:fabernovel/heart.git
```

#### Install the dependencies

```shell
rush install
```

#### Build the modules

As the code is written using TypeScript, it has to be compiled into plain JavaScript.

To do so, a `build` task is defined in the `package.json` of each module.

Rush makes it easy to build only the modules that need to be built. Run the following command from the root directory:

```shell
rush build
```

### Code your enhancements

1. Checkout the newly created branch
2. Code your enhancements

### Test your enhancements

#### End-user testing

You can test a close-to-end-user installation in the `tests` directory.

To do so, you have to:

1. Create a `.env` file in this directory by copying it from `.env.template`, and populate it with the environment variables needed by all the modules.

2. Install the packages:

    ```shell
    pnpm install
    ````

3. Starts an analysis using the CLI. You can list the available analysis by using:

    ```shell
    pnpx heart -h
    ```

    Example of a CLI command using the _Heart Dareboost_ module:

    ```shell
    pnpx heart dareboost -i '{"url": "https://heart.fabernovel.com/"}'
    ```

### Provide a changelog

Your enhancements may require to provide a list of changes and an increase in the package version number.

You can check if you need to provide these two with:

```shell
rush change --verify
```

If you get a message that says
> The following projects have been changed and require change descriptions [...]

You have to provide the list of changes and the type of version number implied by these changes. _Heart_ version number follows the [semver rules](https://semver.org/): `major.minor.patch`.

Providing the changes is done by using

```shell
rush change
```

You will be asked to provide, for each package that has changed:

* a description of the changes following the [Rush best practices](https://rushjs.io/pages/best_practices/change_logs/)
* the type of version increment: `minor` or `patch`, as the `major` version number is locked amongst every package

### Submit your enhancements

Now that your enhancements work perfectly and that you provide a changelog, it is time to submit for review:

1. Push your local changes to the remote
2. Using the Gitlab interface, check that every pipeline is green on the _Merge Request_
3. If so, you can remove the _WIP:_ prefix from the title.
    
    If not, you have to open the pipeline and see what is failing, update your code and start the submitting process again.

The merging operation will then be done by a core team member.
