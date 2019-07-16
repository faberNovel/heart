# Contributing to _Heart_

## Make sure that an issue exists

Before coding, you first have to make sure that the changes you want to make are described in an issue.

1. Make sure the issue does not already exists or has no merge request yet
2. Create the issue it does not already exist

## Reporting Bugs

Before creating bug reports, please check [this list](https://gitlab.com/fabernovel/heart/-/boards) as you might find out that you don't need to create one.

When you are creating a bug report, please include as many details as possible.

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

_Heart_ handle every modules in a single repository that is managed with [Rush](https://rushjs.io/) and [pnpm](https://pnpm.js.org/).

So make sure you have them both installed on your computer before you begin.

You can now clone the repository:

```shell
git clone git@gitlab.com:fabernovel/heart.git
```

Once you cloned the repository, you have to install every module. Do that by using the following command from the root folder

```shell
rush install
```

### Code your enhancements

Get back to your local environment.

1. Checkout the newly created branch
2. Code your enhancements

### Test your enhancements

1. Build the modules that have changed, by using

    ```shell
    rush build
    ```
2. Test the new features like a real user: go to the `tests/` directory, and install the dependencies:

    ```shell
    pnpm install
    ```

    You can now test the CLI by using the `pnpx heart` command

### Provide a changelog

Your enhancements may require to provide a list of changes and an increase in the package version number.

You can check if you need to provide these two with
    
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

* a description of the changes
* the type of version increment: `minor` or `patch`, as the `major` version number is locked amongst every package

### Submit your enhancements

Now that your enhancements work perfectly and that you provide a changelog, it is time to submit for review:

1. Check 

    If so, your need to provide
2. Push your local changes to the remote
3. Using the Gitlab interface, check that every pipeline is green on the _Merge Request_
4. If so, you can remove the _WIP:_ prefix from the title. If not, you have to open the pipeline and see what is failing, update your code and get back to step 2.

The merging operation will then be done by a core team member.
