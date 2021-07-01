import Path from "path";

export const runtimeDefaults = {
  externalFunctionInstallFolder: Path.join(process.cwd(), "./external-functions"),
  externalFunctionConfigFileName: "meta-function.json",
};
