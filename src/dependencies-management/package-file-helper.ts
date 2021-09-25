import { promises } from "fs";


export type FreshPackageFile = {
  dependencies : Record<string, string>;
}

export const getNPMPackageFileContent = async () : Promise<FreshPackageFile> => {
  const packagePath = process.cwd();

  return import(`${packagePath}/package.json`);
};

export const prettifyNPMPackageFile = async (
  systemName : string, version : string, description : string,
) : Promise<void> => {
  const packagePath = process.cwd();
  const fileContent = await getNPMPackageFileContent();

  const result = {
    name: systemName.toLocaleLowerCase(),
    version,
    description,
    dependencies:  fileContent.dependencies,
  };

  await promises.writeFile(`${packagePath}/package.json`, JSON.stringify(result, null, 2));
};
