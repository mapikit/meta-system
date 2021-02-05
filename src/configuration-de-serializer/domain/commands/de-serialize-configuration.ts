import { Configuration } from "@api/configuration-de-serializer/domain/configuration";
import { isConfigurationType }
  from "@api/configuration-de-serializer/domain/assertions/configuration/is-configuration-type";
import { DeserializeSchemasCommand } from "./de-serialize-schemas";
import { DeserializeBopsCommand } from "./de-serialize-bops";

export class DeserializeConfigurationCommand {
  private _result : Configuration;

  public get result () : Configuration {
    return this._result;
  };

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
