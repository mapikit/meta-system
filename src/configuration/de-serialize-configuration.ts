import clone from "just-clone";
import { validateObject } from "@meta-system/object-definition";
import { DeserializeBopsCommand } from "./business-operations/de-serialize-bops.js";
import { Configuration } from "./configuration.js";
import { PathUtils } from "./path-alias-utils.js";
import { DeserializeSchemasCommand } from "./schemas/de-serialize-schemas.js";
import { configurationTypeDefinition } from "./configuration-definition.js";

const referenceableProperties : Array<keyof Configuration> = [
  "schemas",
  "businessOperations",
];

export class DeserializeConfigurationCommand {
  private _result : Configuration;

  public get result () : Configuration {
    return this._result;
  };

  // eslint-disable-next-line max-lines-per-function
  public async execute (input : unknown) : Promise<void> {
    this._result = clone(input as object) as Configuration;
    await this.replaceReferences(this._result);
    const validationOutput = validateObject(this._result, configurationTypeDefinition);

    // TODO: Log validation errors and abort

    const schemasValidationCommand = new DeserializeSchemasCommand();
    schemasValidationCommand.execute(this._result.schemas);

    const bopsValidationCommand =  new DeserializeBopsCommand();
    bopsValidationCommand.execute(this._result.businessOperations);

    // const protocolsValidationCommand = new DeserializeProtocolsCommand();
    // protocolsValidationCommand.execute(this._result.protocols ?? []);
    this._result = new Configuration(
      {
        ...this._result,
        schemas: schemasValidationCommand.resultSchemas,
        businessOperations: bopsValidationCommand.bopsResults,
        addons: input["addons"],
        // TODO add addon validation
      },
    );
  }

  private async replaceReferences (input : unknown) : Promise<void> {
    for(const property of referenceableProperties) {
      input[property] = await PathUtils.getContents(input[property]);
    }
  }
}
