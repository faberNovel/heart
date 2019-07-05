# Description

_Heart CLI_ is a _runner_ module of _Heart_, which starts an analysis by using a CLI.

Note that you must have installed an _analysis_ module too.

Read more about the purpose, design and general installation of _Heart_ on [the dedicated wiki](https://gitlab.com/fabernovel/heart/wikis/What-is-Heart).

# Installation

Add the package to your project:

```shell
npm install @fabernovel/heart-cli
```

# Usage

_Heart CLI_ allows you to start the analysis of a single URL with a single service at a time.

## General

```shell
npx heart analysis --service /<analysisModuleName> --file <file>
```

or

```shell
npx heart analysis --service /<analysisModuleName> --inline <data>
```

Explanations:
* `<analysisModuleName>` is the lowercase version of the _analysis_ module name, without the _Heart_ prefix.
* `<file>` is the file path (relative or absolute) to the JSON configuration file. Its content depends of the _analysis_ module you want to use.
* `<data>` is a stringified JSON that contains information about the analysis you want to do. Its content depends of the _analysis_ module you want to use.

## Example

If you have the _analysis_ module [_Heart Observatory_](https://www.npmjs.com/package/@fabernovel/heart-observatory) installed, the command will be:

```shell
npx heart analysis --server /observatory --inline '{"host": "about.gitlab.com"}'
```

Or:

```shell
npx heart analysis --server /observatory --file observatory.json
```
With `observatory.json`:

```json
{
  "host": "about.gitlab.com"
}
```
