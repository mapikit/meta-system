// Validates the meta-function.json of the custom BOps function
import { isMetaFunction } from "@meta-system/meta-function-helper/dist/src/is-meta-function";
import { buildAllFunctionDefinitions, MetaFunction } from "@meta-system/meta-function-helper";
import {
  BuiltMetaProtocolDefinition,
  MetaProtocolDefinition,
  validateProtocolConfiguration,
} from "@meta-system/meta-protocol-helper";

export class ProtocolDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : object,
    private readonly path : string,
    private readonly isDbProtocol : boolean,
  ) { }

  public async validate () : Promise<this> {
    await validateProtocolConfiguration(this.descriptionFileContent, this.path, this.isDbProtocol);
    this.validated = true;

    return this;
  }

  // eslint-disable-next-line max-lines-per-function
  public async getPackageConfiguration () : Promise<BuiltMetaProtocolDefinition> {
    if (!this.validated) {
      throw Error("Package Description Not Validated");
    }

    const fileContent = this.descriptionFileContent as MetaProtocolDefinition;

    if (fileContent.functionDefinitions !== undefined) {
      if (!Array.isArray(fileContent.functionDefinitions)) {
        throw Error("Protocol Contains bad configuration in its functions definitions");
      }

      fileContent.functionDefinitions = await buildAllFunctionDefinitions(fileContent.functionDefinitions, this.path);

      fileContent.functionDefinitions.forEach((functionDef) => {
        isMetaFunction(functionDef as MetaFunction);
      });
    }

    return fileContent as BuiltMetaProtocolDefinition;
  }
}

