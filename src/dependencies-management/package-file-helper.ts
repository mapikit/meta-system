import { runtimeDefaults } from "../configuration/runtime-config/defaults";
import { promises } from "fs";


export type FreshPackageFile = {
  dependencies : Record<string, string>;
}

export const getNPMPackageFileContent = async (customPath : string) : Promise<FreshPackageFile> => {
  const packagePath = customPath ?? runtimeDefaults.externalFunctionInstallFolder;

  return import(`${packagePath}/package.json`);
};

export const prettifyNPMPackageFile = async (
  systemName : string, version : string, description : string, customPath : string,
// eslint-disable-next-line max-params
) : Promise<void> => {
  const packagePath = customPath ?? runtimeDefaults.externalFunctionInstallFolder;
  const fileContent = await getNPMPackageFileContent(packagePath);

  const result = {
    name: systemName.toLocaleLowerCase(),
    version,
    description,
    dependencies:  fileContent.dependencies,
  };

  await promises.writeFile(`${packagePath}/package.json`, JSON.stringify(result, null, 2));
};
