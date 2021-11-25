import { isConfigurationType } from "./assertions/configuration/is-configuration-type";
import { DeserializeBopsCommand } from "./business-operations/de-serialize-bops";
import { Configuration } from "./configuration";
import { PathUtils } from "./path-alias-utils";
import { DeserializeProtocolsCommand } from "./protocols/de-serialize-protocols";
import { DeserializeSchemasCommand } from "./schemas/de-serialize-schemas";

const referenceableProperties : Array<keyof Configuration> = [
  "schemas",
  "protocols",
  "businessOperations",
];

export class DeserializeConfigurationCommand {
  private _result : Configuration;

  public get result () : Configuration {
    return this._result;
  };

  // eslint-disable-next-line max-lines-per-function
  public async execute (input : unknown) : Promise<void> {
    await this.replaceReferences(input);
    isConfigurationType(input);

    const schemasValidationCommand = new DeserializeSchemasCommand();
    schemasValidationCommand.execute(input.schemas);

    const bopsValidationCommand =  new DeserializeBopsCommand();
    bopsValidationCommand.execute(input.businessOperations);

    const protocolsValidationCommand = new DeserializeProtocolsCommand();
    protocolsValidationCommand.execute(input.protocols ?? []);

    this._result = new Configuration(
      {
        ...input,
        schemas: schemasValidationCommand.resultSchemas,
        businessOperations: bopsValidationCommand.bopsResults,
        protocols: protocolsValidationCommand.protocolsResults,
      },
    );
  }

  private async replaceReferences (input : unknown) : Promise<void> {
    for(const property of referenceableProperties) {
      input[property] = await PathUtils.getContents(input[property]);
    }
  }
}
