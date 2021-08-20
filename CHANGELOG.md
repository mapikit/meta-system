# Changelog
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
- Replaced the extra character at the start of `moduleRepo`. Instead we populate a new field called `moduleType`.
- New parameter `modulePackage`. It is populated to specify the package of external function, the name of the schema, and the name of the protocol.

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
