# Setup your local environment

## Install the requirements

Make sure you're using Node.js in the same or superior version to the one indicated in the .nvmrc file.

If you have [nvm](https://github.com/nvm-sh/nvm) installed:

```
nvm use
```

_Heart_ handle every modules in a single repository that is managed with [Rush](https://rushjs.io/).

So make sure you have it installed on your computer before you begin:

```shell
npm install -g @microsoft/rush
```

## Clone the repository

```shell
git clone git@github.com:faberNovel/heart.git
```

## Install the dependencies

```shell
rush install
```

## Build the modules

As the code is written using TypeScript, it has to be compiled into plain JavaScript.

To do so, a `build` task is defined in the `package.json` of each module.

Rush makes it easy to build only the modules that need to be built. Run the following command from the root directory:

```shell
rush build
```
