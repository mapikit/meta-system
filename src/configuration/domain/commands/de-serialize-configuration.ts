import "module-alias/register";
import { Configuration } from "@api/configuration/domain/configuration";
import { isConfigurationType }
  from "@api/configuration/domain/assertions/configuration/is-configuration-type";
import { DeserializeSchemasCommand } from "./de-serialize-schemas";
import { DeserializeBopsCommand } from "./de-serialize-bops";
import { CheckBopsFunctionsDependenciesCommand } from "./check-bops-functions-dependencies";

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

    const dependencyValidation = new CheckBopsFunctionsDependenciesCommand(input.schemas);

    bopsValidationCommand.bopsResults.forEach((bop) => {
      dependencyValidation.execute(bop);
    });

    this._result = new Configuration(
      {
        ...input,
        schemas: schemasValidationCommand.resultSchemas,
        businessOperations: bopsValidationCommand.bopsResults,
      },
    );
  }
}
