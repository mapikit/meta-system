// Validates the meta-function.json of the custom BOps function
import MetaFunctionHelper, { BuiltMetaPackage, MetaPackage } from "meta-function-helper";
import { buildFullPackageDescription } from "meta-function-helper/dist/src/build-full-package-description";

export class MetaPackageDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : string,
  ) { }

  public async validate () : Promise<this> {
    await MetaFunctionHelper
      .validatePackageStringConfiguration(this.descriptionFileContent);
    this.validated = true;

    return this;
  }

  public async getPackageConfiguration () : Promise<BuiltMetaPackage> {
    if (!this.validated) {
      throw Error("Package Description Not Validated");
    }

    const fileContent = JSON.parse(this.descriptionFileContent) as MetaPackage;

    return buildFullPackageDescription(fileContent);
  }
}

