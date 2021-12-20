// Validates the meta-function.json of the custom BOps function
import { isMetaFunction } from "@meta-system/meta-function-helper/dist/src/is-meta-function";
import { buildAllFunctionDefinitions, MetaFunction } from "@meta-system/meta-function-helper";
import {
  BuiltMetaProtocolDefinition,
  MetaProtocolDefinition,
  validateProtocolConfiguration
} from "@meta-system/meta-protocol-helper";

export class ProtocolDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : string,
  ) { }

  public async validate (customPath : string) : Promise<this> {
    await validateProtocolConfiguration(this.descriptionFileContent, customPath);
    this.validated = true;

    return this;
  }

  // eslint-disable-next-line max-lines-per-function
  public async getPackageConfiguration () : Promise<BuiltMetaProtocolDefinition> {
    if (!this.validated) {
      throw Error("Package Description Not Validated");
    }

    const fileContent = JSON.parse(this.descriptionFileContent) as MetaProtocolDefinition;

    if (fileContent.functionDefinitions !== undefined) {
      if (!Array.isArray(fileContent.functionDefinitions)) {
        throw Error("Protocol Contains bad configuration in its functions definitions");
      }

      // TODO: Get the name of the file and generate the path
      fileContent.functionDefinitions = await buildAllFunctionDefinitions(fileContent.functionDefinitions);

      fileContent.functionDefinitions.forEach((functionDef) => {
        isMetaFunction(functionDef as MetaFunction);
      });
    }

    return fileContent as BuiltMetaProtocolDefinition;
  }
}

