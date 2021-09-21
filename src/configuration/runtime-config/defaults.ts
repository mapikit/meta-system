import Path from "path";

export const runtimeDefaults = {
  // We wanted to have a separate folder for external functions, but unfortunately,
  // Node.js can only solve modules from `node_modules` and nothing else
  // And no - there is no way to change it. :(
  externalFunctionInstallFolder: Path.join(process.cwd(), "./node_modules"),
  externalFunctionConfigFileName: "meta-function.json",
  externalPackageConfigFileName: "meta-package.json",
  externalProtocolConfigFileName: "meta-protocol.json",
};
