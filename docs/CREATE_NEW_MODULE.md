# Create a new module

Creating a new module is about copying the module template directory, then rename some files and variable names.

1. Copy the _modules/heart-moduletpl_ directory, and name it by using the branding name of the service you want to use, prefixed by _heart-_ (example: _heart-dareboost_)

2. Put a 192x192 PNG logo of the service you want to use and put it in the `assets/images/logos/` directory

3. Update some copied files:
    - Replace the `moduletpl` and `ModuleTpl` strings of every files and variables names
    - Make sure that the `description` field of the _package.json_ file and the `name` and `service.name` set in the _src/index.ts_ file make sense
    - Make sure that the `service.logo` property set in the _src/index.ts_ file has the correct path to the picture you put at the previous step

4. Now indicates to Rush that he has to manage your new module: add the following lines to the array under the `project` key of the `rush.json` file:
    ```json
    {
      "packageName": "@fabernovel/heart-brandservice",
      "projectFolder": "modules/heart-brandservice",
      "versionPolicyName": "individualVersion"
    },
    ```

5. Now you just have to install the dependencies and make sure everything is fine by building your module:
    1. `rush update`
    2. `rush build`  
