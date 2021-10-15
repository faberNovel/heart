# Create a new module

Creating a new module is about creating a new folder and put a bunch of required files in it.

1. Copy the _modules/heart-moduletpl_ directory, and name it by using the branding name of the service your adding prefixed by _heart_ (example: _heart-brandservice_)

2. Put a 192x192 PNG logo of the service you want to use and put it in the `assets/images/logos/` directory

3. Update some copied files:
    - Replace the `moduletpl` string of every files and variables names of your new module directory
    - Make sure that the `description` field of the _package.json_ file and the `name` and `service.name` set in the _src/index.ts_ file make sense
    - Make sure that the `service.logo` property set in the _src/index.ts_ file has the correct path to the picture you put at the previous step

4. Add the module to the list of modules Rush has to handle: add the following lines to the array under the `project` key of the `rush.json` file:
    ```json
    {
      "packageName": "@fabernovel/heart-brandservice",
      "projectFolder": "modules/heart-brandservice",
      "versionPolicyName": "individualVersion"
    },
    ```

5. Install and build the module:
    1. `rush update`
    2. `rush build`  
