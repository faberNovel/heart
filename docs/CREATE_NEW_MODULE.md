# Create a new module

Creating a new module is about copying the module template directory, then rename some files and variable names.

1. Copy the _modules/heart-moduletpl_ directory (except the .rush, node_modules and lib directories inside).

2. In the copied directory, search and replace the `moduletpl` and `ModuleTpl` strings of every files and directories

3. Update the `description`, `license` and `contributors` fields of the pakage.json file 

4. Indicates to Rush that he has to manage your new module: add the following lines to the array under the `project` key of the `rush.json` file:
    ```json
    {
      "packageName": "@fabernovel/heart-moduletpl",
      "projectFolder": "modules/heart-moduletpl",
      "versionPolicyName": "individualVersion"
    },
    ```

5. Install the dependencies and make sure everything is fine by building your module and run the _lint_ and _test_ steps:
    1. `rush update`
    2. `rush build`
    3. `rush lint`
    4. `rush test`

6. [Analysis module only] 

    Put a 192x192 PNG logo of the service you want to use in the `assets/images/logos/` directory.

    Make sure that the PNG file is optimized with tools like [Squoosh](https://squoosh.app/).

    Update the path to this file by updating the `service.logo` property set in the _src/index.ts_ file

7. Make the `ModuleTplModule` class implements the `ModuleAnalysisInterface` or the `ModuleListenerInterface` class, depending of the type of module you want to create.

You now have a new empty working module and can start the implementation of your business code.

If you have some difficulties to implement a new module, have a look at the existing modules to help you. 
