import "module-alias/register";
import { Configuration } from "@api/configuration/configuration";
import { isConfigurationType }
  from "@api/configuration/assertions/configuration/is-configuration-type";
import { DeserializeSchemasCommand } from "@api/configuration/schemas/de-serialize-schemas";
import { DeserializeBopsCommand } from "@api/configuration/business-operations/de-serialize-bops";

export class DeserializeConfigurationCommand {
  private _result : Configuration;

  public get result () : Configuration {
    return this._result;
  };

  // eslint-disable-next-line max-lines-per-function
  public execute (input : unknown) : void {
    isConfigurationType(input);

    const schemasValidationCommand = new DeserializeSchemasCommand();
    schemasValidationCommand.execute(input.schemas);

    const bopsValidationCommand =  new DeserializeBopsCommand();
    bopsValidationCommand.execute(input.businessOperations);

    this._result = new Configuration(
      {
        ...input,
        schemas: schemasValidationCommand.resultSchemas,
        businessOperations: bopsValidationCommand.bopsResults,
      },
    );
  }
}
