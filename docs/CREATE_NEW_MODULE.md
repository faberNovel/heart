# Create a new module

Creating a new module is about copying the module template directory, then rename some files and variable names.

1. Copy the _modules/heart-moduletpl_ directory, and name it by using the branding name of the service you want to interface with, prefixed by _heart-_ (example: _heart-dareboost_)

2. Put a 192x192 PNG logo of the service you want to use and put it in the `assets/images/logos/` directory.

    Make sure that the PNG file is optimized with tools like [Squoosh](https://squoosh.app/).

3. Update the copied files:
    1. Make the `ModuleTplModule` class implements the `ModuleAnalysisInterface` or the `ModuleListenerInterface` class, depending of the type of module you want to create. Read more about the design of _heart_ if you don't know about the different types of modules.
    2. Search and replace the `moduletpl` and `ModuleTpl` strings of every files and variables names
    3. Update the `description` and `contributors` fields in the _package.json_ file
    4. Make sure that the `service.logo` property set in the _src/index.ts_ file has the correct path to the picture you put at the previous step

4. Indicates to Rush that he has to manage your new module: add the following lines to the array under the `project` key of the `rush.json` file:
    ```json
    {
      "packageName": "@fabernovel/heart-brandservice",
      "projectFolder": "modules/heart-brandservice",
      "versionPolicyName": "individualVersion"
    },
    ```

5. Install the dependencies and make sure everything is fine by building your module and run the _lint_ and _test_ steps:
    1. `rush update`
    2. `rush build`
    2. `rush lint`
    2. `rush test`

You now have a new empty working module and can start the implementation of your business code.
