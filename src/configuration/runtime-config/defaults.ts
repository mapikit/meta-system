import Path from "path";

export const runtimeDefaults = {
  externalFunctionInstallFolder: Path.join(process.cwd(), "./runtime"),
  externalFunctionConfigFileName: "meta-function.json",
  externalPackageConfigFileName: "meta-package.json",
  externalProtocolConfigFileName: "meta-protocol.json",
};
