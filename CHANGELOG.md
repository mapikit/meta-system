# Changelog
## 0.4.0 - Andromeda
### Addons!
- External Functions, Protocols, and DB Protocols now unified under `"Addons"`.
- Addons are easier to create, or to convert an exsiting library to be compatible to use with Meta-System.
- Addons can now be loaded from a file on your computer
- Addons can now be loaded from a GitHub/BitBucket/GitLab repo (must be JS though)
- Addons can be downloaded from a file on the internet
- Meta-System now checks for the configuration type, so the Addon does not need to.
- Deprecated support libraries `meta-function-helper` and `meta-protocol-helper`. No more support packages needed to build addons, just build it.


### New Internal Architecture
- The new architecture decouples the data of the system and exposes actions to add/edit that data. This same achitecture enables us to expose a better API so Addons can do more with systems:
  - Edit and add schemas.
  - Override, and create BOps calls.
  - Insert new configuration details into the system.
- Removed manual configuration type checks - Now we're using `ObjectDefinition` internally to check for a valid configuration. This change removed over 500 lines of code, while improving error reporting.
- Redone the internal boot process to support Addons and their operations
-----

## 0.3.4
- Fixed `runtime` folder creation
- Removed negative keys invalidation
- Fixed glob patterns on Windows
- Fixed some pathing errors on Windows

## 0.3.3
- Migrated to use ES Modules instead of common JS. This is preparatory work for enabling Meta-System to work on browsers.

## 0.3.2
- Updated meta-protocol-helper and meta-function-helper
- Fixed system crashing on BOp failure
- All BOps working directory will now be the install directory (\<System Config Directory\>/runtime)
  - This prevents BOp modules that use disk operations from installing in a folder that is not the config folder

## 0.3.1
- Improved BOps TTL (Time to Live) Configuration
  - Each BOp may have a specific ttl value and the default can be set via CLI (`--ttl` or `-T`). Default ttl is 2000 ms.

## 0.3.0
### File Splitting
- System `schemas`, `businessOperations`, and `protocols` configuration json can now be split into multiple files.
- The allowed properties can be replaced by:
  - A string path pointing to a json file of an array of the property type
  - An array of paths pointing to a multiple files with multiple configurations
  - A glob pattern that includes those configurations
  - An array of glob patterns that include multiple configurations
  - Or a mix of all the above. For more info consult our [documentation](https://mapikit.github.io/meta-system-docs/)
- Databases are now protocols, allowing for multiple databases to be implemented
  - MongoDB, previously baked into meta-system, has been separated as its own db protocol: [@meta-system/mongodb-db-protocol](https://www.npmjs.com/package/@meta-system/mongodb-db-protocol)
- Added a custom logger for meta-system and added debugging to BOps execution flow
  - This new implementation also comes with logging levels (see below)
- Improved the meta-system CLI options
  - Currently the available options are debug, create-log-file, log-level, and type-check.
  - For more info on those as well as some extra accessory options you can use the --help to option
- It is now possible to insert arrays directly from the "targetPath" as described in issue #83
  - Writing it as `targetArray[]` will push the value to an array called `targetArray`
  - Writing as `targetArray[n]` will insert the value at the specified `n` index
  - When using a fixed index, you may also insert complex objects. For instance:
    - `targetArray[2].name` will add an object at index 2 and set the name property to the given value.

## 0.2.3
- Fixed bug #64 . The package dependency manager was not handling the case of having multiple installations of the same package if its version was "latest"

## 0.2.2
- Fixed variable functions not working with multiple internal BOps.
- Fixed modular inputs (`originPath: "module"`) flow.
  - Now all the modular inputs (and its dependencies) are executed on a separated context.
  - In practice this means they are isolated from the rest of the flow, and only called by other functions.

## 0.2.1
- Fixed verification for BOps dependency in BOps.
- Added logs for when the dependency prop validation fails.
- Added flag for skipping validation entirely: `--skip-prop-validation`.

## 0.2.0 - Gemini
Gemini is here! Meta-System got a power up on the protocols and the external functions. There was also a gib difference in the configuration of BOps. Check the differences below!
### Protocols
- Now we have external protocols! They are automatically downloaded by mentioning them in your config, just like external functions.
- We no longer have internal protocols though. We believe it is a good approach to let the core of the Meta-System cleaner.
- Protocols now can provide functions to be used in the BOps, for clever and interesting applications! You may, for instance, activate through HTTP an BOp that enables listening to a Message Queue.
- New library to support the development of protocols is out! Check [meta-protocol-helper](https://www.npmjs.com/package/meta-protocol-helper)

### External Functions
- Now you can bundle your functions in a package! The npm package `meta-function-helper` was updated to support this.

### BOps configuration
We used to have an extra character before the configuration to specify what kind of module it was. We found that it was a rather silly approach.
- Replaced the extra character at the start of `moduleRepo`. Instead we populate a new field called `moduleType`. `moduleRepo` has also been renamed to `moduleName` to avoid confusion.
- New parameter `modulePackage`. It is populated to specify the package of external function, the name of the schema, and the name of the protocol.
- Both `constants` and `variables` can now accept a few extra types:
  - Type `"object"` means the value must be an object such as `{ name: "John", age: 30 }`;
  - Type `"array"` enforces the value is a list of items, for example: `[ "John", 30, "Programmer" ]`;
  - Type `"any"` allows the value to be absolutely any type;

### New Variable Model
Now you don't need to supply the variable name as an input to update its value, instead the variable name is read from the targetPath of every `setVariables` dependency. For example, if you add the following dependency to the `setVariables` module:
 - `{ origin: "constants", originPath: "piConstant", targetPath: "halfTau" }`
The variable named `halfTau` will be equal to the constant `piConstant`.
Also, as the name suggests, now you can set multiple variables at the same time. Theese changes also apply to the `increaseVariables` and `decreaseVaraibles` functions.

### New System Functions
There are new internal functions which the purpose is to provide a way to monipulate meta system more deeply:
- `getSystemFunction` - To get any function from the installed ones or BOps;
- `executeWithArgs` - To execute a function upon command;

---
## 0.1.6-2
Adds `-v` as a CLI argument for checking the version

## 0.1.6-1
Fixes package publishing on NPM

## 0.1.6
Added reload (`rs` command) and hot-reload (`--dev` flag) capabilities.
Added some coloring to a few console lines.

## 0.1.5
Added forLoop internal function

## 0.1.4
Added variables and variable related functions. Variable value can be changed during runtime

## 0.1.3
Fixes issue [#46](https://github.com/mapikit/meta-system/issues/46).
Meta-system now has types available built-in the NPM package.

## 0.1.2
Fixes bug [#44](https://github.com/mapikit/meta-system/issues/44).
## 0.1.1
No change on the code. Meta-System repo is now licenced through GPL-3.0

## 0.1.0
The initial version of Meta-System.
It is possible to create systems with a JSON following the specified configuration.
