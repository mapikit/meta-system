import { promises } from "fs";
import { environment } from "../common/execution-env";

export type FreshPackageFile = {
  dependencies : Record<string, string>;
}

export const getNPMPackageFileContent = async (customPath : string) : Promise<FreshPackageFile> => {
  const packagePath = customPath ?? environment.constants.installDir;

  return import(`${packagePath}/package.json`);
};

export const prettifyNPMPackageFile = async (
  systemName : string, version : string, description : string, customPath : string,
// eslint-disable-next-line max-params
) : Promise<void> => {
  const packagePath = customPath ?? environment.constants.installDir;
  const fileContent = await getNPMPackageFileContent(packagePath);

  const result = {
    name: systemName.toLocaleLowerCase(),
    version,
    description,
    dependencies:  fileContent.dependencies,
  };

  await promises.writeFile(`${packagePath}/package.json`, JSON.stringify(result, null, 2));
};
