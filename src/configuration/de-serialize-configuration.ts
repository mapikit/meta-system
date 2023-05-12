import clone from "just-clone";
import { validateObject } from "@meta-system/object-definition";
import { Configuration } from "./configuration.js";
import { PathUtils } from "./path-alias-utils.js";
import { configurationTypeDefinition } from "./configuration-definition.js";
import { ValidationOutput } from "@meta-system/object-definition/dist/functions/validate-object.js";
import { logger } from "../common/logger/logger.js";

const referenceableProperties : Array<keyof Configuration> = [
  "schemas",
  "businessOperations",
];

export class DeserializeConfigurationCommand {
  private _result : Configuration;
  public validation : ValidationOutput;

  public get result () : Configuration {
    return this._result;
  };

  // eslint-disable-next-line max-lines-per-function
  public async execute (input : unknown) : Promise<void> {
    this._result = clone(input as object) as Configuration;
    await this.replaceReferences(this._result);
    this.validation = validateObject(this._result, configurationTypeDefinition);

    this.logErrorsAndAbort(this.validation);
    // TODO: Log validation errors and abort

    // const schemasValidationCommand = new DeserializeSchemasCommand();
    // schemasValidationCommand.execute(this._result.schemas);

    // const bopsValidationCommand =  new DeserializeBopsCommand();
    // bopsValidationCommand.execute(this._result.businessOperations);

    // const protocolsValidationCommand = new DeserializeProtocolsCommand();
    // protocolsValidationCommand.execute(this._result.protocols ?? []);
    this._result = new Configuration(
      {
        ...this._result,
        schemas: [],
        businessOperations: [],
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

  private logErrorsAndAbort (validation : ValidationOutput) : void {
    validation.errors.forEach(err => {
      logger.error(`[CONFIG VALIDATION] Error at configuration path: "${err.path}" -- `, err.error);
    });

    if (validation.errors.length > 0) {
      throw Error("Config validation failed!");
    }
  }
}
