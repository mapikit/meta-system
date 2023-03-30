// Validates the meta-function.json of the custom BOps function
import {
  buildAllFunctionDefinitions,
  BuiltMetaPackage,
  MetaPackage,
  validatePackageConfiguration,
} from "@meta-system/meta-function-helper";
import { environment } from "../../common/execution-env.js";

export class MetaPackageDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : object,
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

    const pathLib = await import("path");

    const fileContent = this.descriptionFileContent as MetaPackage;
    const path = pathLib.join(environment.constants.installDir, fileContent.name,fileContent.entrypoint);

    fileContent.functionsDefinitions = await buildAllFunctionDefinitions(fileContent.functionsDefinitions, path);
    return fileContent as BuiltMetaPackage;
  }
}

