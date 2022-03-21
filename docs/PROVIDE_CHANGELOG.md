# Provide a changelog

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
