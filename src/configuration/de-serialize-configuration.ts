import { isConfigurationType } from "./assertions/configuration/is-configuration-type";
import { DeserializeBopsCommand } from "./business-operations/de-serialize-bops";
import { Configuration } from "./configuration";
import { DeserializeSchemasCommand } from "./schemas/de-serialize-schemas";

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
