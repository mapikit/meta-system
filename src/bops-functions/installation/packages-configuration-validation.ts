// Validates the meta-function.json of the custom BOps function
import {
  buildAllFunctionDefinitions,
  BuiltMetaPackage,
  MetaPackage,
  validatePackageConfiguration
} from "@meta-system/meta-function-helper";

export class MetaPackageDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : string,
  ) { }

  public async validate () : Promise<this> {
    await validatePackageConfiguration(this.descriptionFileContent);
    this.validated = true;

    return this;
  }

  public async getPackageConfiguration () : Promise<BuiltMetaPackage> {
    if (!this.validated) {
      throw Error("Package Description Not Validated");
    }

    const fileContent = JSON.parse(this.descriptionFileContent) as MetaPackage;
    // TODO: Get the name of the file and generate the path

    fileContent.functionsDefinitions = await buildAllFunctionDefinitions(fileContent.functionsDefinitions);
    return fileContent as BuiltMetaPackage;
  }
}

