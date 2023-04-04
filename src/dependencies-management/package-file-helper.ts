import { promises, existsSync } from "fs";
import Path from "path";
import { environment } from "../common/execution-env.js";

export type FreshPackageFile = {
  dependencies : Record<string, string>;
}

export const getNPMPackageFileContent = async (customPath : string) : Promise<FreshPackageFile> => {
  const packagePath = customPath ?? environment.constants.installDir;

  return JSON.parse((await promises.readFile(`${packagePath}/package.json`)).toString());
};

export const prettifyNPMPackageFile = async (
  systemName : string, version : string, description : string, customPath : string,
// eslint-disable-next-line max-params
) : Promise<void> => {
  const packagePath = customPath ?? environment.constants.installDir;
  if(!existsSync(Path.join(packagePath, "package.json"))) return; // Return if nothing is installed
  const fileContent = await getNPMPackageFileContent(packagePath);

  const result = {
    name: systemName.toLocaleLowerCase(),
    version,
    description,
    dependencies:  fileContent.dependencies,
  };

  await promises.writeFile(`${packagePath}/package.json`, JSON.stringify(result, null, 2));
};
