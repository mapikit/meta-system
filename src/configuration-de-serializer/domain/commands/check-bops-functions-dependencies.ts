import { BusinessOperation } from "@api/configuration-de-serializer/domain/business-operation";
import { Schema } from "@api/configuration-de-serializer/domain/schema";

interface BopsDependencies {
  fromSchemas : string[];
  internal : string[];
  fromConfigurations : string[]; // From inputs/constants
  fromOutputs : string[];
  external : string[];
}

/**
 * Command to check if the dependencies for a given configuration are met
 *
 * Dependencies are code or information that resides outside the configuration for
 * the meta-system, be it a runtime attribute or a function described at it.
 */
export class CheckBopsFunctionsDependenciesCommand {
  private schemas : Set<string> = new Set();
  private businessOperation : BusinessOperation;
  private dependencies : BopsDependencies;

  public constructor (schemas : Schema[]) {
    schemas.forEach((schema) => {
      this.schemas.add(schema.name);
    });
  }

  public execute (businessOperation : BusinessOperation) : void {
    this.businessOperation = businessOperation;
    // get all current dependencies, separated by type:
    // - From Schemas
    // - Internal
    // - From Constants/Inputs/Outputs
    // - External
    this.extractDependencies();

    // Check if required configurational functions/data exists
    this.checkConfigurationalDependencies();

    // Check if required internal functions exist

    // Check if required shcema functions exists

    // Check if required external functions exists and are valid
  }

  // eslint-disable-next-line max-lines-per-function
  private extractDependencies () : void {
    const externalDependencies = [];
    const internalDependencies = [];
    const outputsDependencies = [];
    const schemasDependencies = [];
    const configurationalDependencies = [];

    // eslint-disable-next-line max-lines-per-function
    this.businessOperation.configuration.forEach((bopsFunctionConfig) => {
      const typeChar = bopsFunctionConfig.moduleRepo.charAt(0);

      enum Chars {
        internal = "#",
        schema = "@",
        parameters = "!",
        outputs = "%",
      };

      const currentType = Chars[typeChar];

      bopsFunctionConfig.inputsSource.forEach((inputSource) => {
        if (typeof inputSource.source === "string") {
          configurationalDependencies.push(inputSource.source);
        }
      });

      if (currentType === undefined) {
        return externalDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      if (currentType === Chars.internal) {
        return internalDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      if (currentType === Chars.outputs) {
        return outputsDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      schemasDependencies.push(bopsFunctionConfig.moduleRepo);
    });

    this.dependencies = {
      internal: internalDependencies,
      external: externalDependencies,
      fromOutputs: outputsDependencies,
      fromSchemas: schemasDependencies,
      fromConfigurations: configurationalDependencies,
    };
  }

  // eslint-disable-next-line max-lines-per-function
  private checkConfigurationalDependencies () : void {
    const availableOutputFunctions = this.businessOperation.outputs.map((output) => {
      return `%${output.name}`;
    });

    const availableInputAndConstantsData = [];
    this.businessOperation.inputs.forEach((input) => {
      availableInputAndConstantsData.push(`!${input.name}`);
    });

    this.businessOperation.constants.forEach((constantDeclaration) => {
      availableInputAndConstantsData.push(`!${constantDeclaration.name}`);
    });

    this.dependencies.fromConfigurations.forEach((configurationDependency) => {
      const configurationExists = availableInputAndConstantsData.includes(configurationDependency);

      if (!configurationExists) {
        // eslint-disable-next-line max-len
        throw Error(`There is an error on the configuration: Unmet dependency from inputs or constants "${configurationDependency}"`);
      }
    });

    this.dependencies.fromOutputs.forEach((outputDependency) => {
      const outputExists = availableOutputFunctions.includes(outputDependency);

      if (!outputExists) {
        throw Error(`There is an error on the configuration: Unmet dependency from outputs "${outputDependency}"`);
      }
    });
  }
}
