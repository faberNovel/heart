# Create a new module

Creating a new module is about choosing the type of module and a name (the hardest parts!), then copy the module template directory and rename some files and variable names.

1. Choose the type of module you want to create:
    - an _analysis_ module, which grades webpages and send best practices eventually
    - a _listener_ module, which operate the results of the _analysis_ modules

2. Choose a name for your module.

    💡 If your module is using a third-party service (like _Google Lighthouse_ or _MySQL_), you may want to use this name, as it will help other users to quickly identify what your module is about.

    For the rest of this guide, we will use the fictive third-party service _Beat_, so our module name will be `Beat`.

3. Duplicate the _modules/moduletpl_ directory and rename it to _modules/beat_.

4. In the _modules/beat_ directory, search the `moduletpl` and `ModuleTpl` strings in each file **and filename** and replace them with `beat` and `Beat` respectively.

5. Put a 192x192 PNG logo of the service your module is using in the `assets/images/logos/` directory, and name the file `Beat.png`.

    💡 Make sure that the PNG file is optimized with tools like [Squoosh](https://squoosh.app/).

6. Update the following fields of the package.json file:
    - `description`
    - `license`
    - `contributors`
    - `heart`: this field contains the metadata of your Heart module. With the previous step, it should look like that now:
    
        ```json
        "heart": {
            "id": "beat",
            "name": "Heart Beat",
            "service": {
                "name": "Beat",
                "logoUrl": "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/Beat.png?v=20221126"
            }
        }
        ```

        Explanations about these fields:
        - `id` is the unique identifier of your module amongst every heart module. If you are creating an _analysis_ module, this value will be used to generate the CLI command `npx heart beat`.
        - `name` is the full name of your module
        - `service.name` is the name of the third-party service your module is using
        - `service.logoUrl` is the public URL to the third-party service logo. The `?v=20221126` parameter at the end of the URL is a technique to trigger a re-download of the picture when the `20221126` value changes; and this value must be changed only if the picture changes.

    💡 If you are unsure about some values, take a look at the package.json files of the existing modules to help you.

7. Make Rush aware of your new module: add the following lines to the array under the `projects` key of the `rush.json` file (at the end of the file):
    ```json
    {
      "packageName": "@fabernovel/heart-beat",
      "projectFolder": "modules/beat",
      "versionPolicyName": "individualVersion"
    },
    ```

8. Install the dependencies and make sure everything is fine by building your module and run the _lint_ and _test_ steps:
    1. `rush update`
    2. `rush build`
    3. `rush lint`
    4. `rush test`

9. Make the `BeatModule` class implements the `ModuleAnalysisInterface` or the `ModuleListenerInterface` class, depending of the type of module you want to create.

You now have a new empty working module and can start the implementation of your business code.

💡 If you have some difficulties to implement your new module, take a look at the existing modules to help you.
