import { BusinessOperation } from "@api/configuration-de-serializer/domain/business-operation";
import { Schema } from "@api/configuration-de-serializer/domain/schema";
import { externalFunctionIsLoaded } from "@api/external-functions/domain/external-function-is-loaded";
import { checkInternalFunctionExist } from "@api/internal-functions";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

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
    this.extractDependencies();

    // Check if required configurational functions/data exists
    this.checkConfigurationalDependencies();

    // Check if required internal functions exist
    this.checkInternalFunctionsDependencies();

    // Check if required schema functions exists
    this.checkSchemaFunctionsDependencies();

    // Check if required external functions exists and are valid
    this.checkExternalRequiredFunctions();
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

      const typeCharsEnum = {
        internal: "#",
        schema: "@",
        parameters: "!",
        outputs: "%",
      };

      bopsFunctionConfig.dependencies.forEach((dependency) => {
        if (dependency.origin === "constant" || dependency.origin === "input") {
          configurationalDependencies.push(
            this.fromPropertyPathToType(dependency.originPath),
          );
        }
      });

      if (typeChar === typeCharsEnum.internal) {
        return internalDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      if (typeChar === typeCharsEnum.outputs) {
        return outputsDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      if (typeChar === typeCharsEnum.schema) {
        return schemasDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      externalDependencies.push(bopsFunctionConfig.moduleRepo);
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
    // This method should only check for the presence of the field, thus, should disregard types
    // and property accesses such as "!data.property", needing only to verify the "!data" part
    const availableOutputFunctions = ["%output"];

    const availableInputAndConstantsData = [];

    Object.keys(this.businessOperation.input).forEach((inputName) => {
      availableInputAndConstantsData.push(`${inputName}`);
    });

    this.businessOperation.constants.forEach((constantDeclaration) => {
      availableInputAndConstantsData.push(`${constantDeclaration.name}`);
    });

    this.dependencies.fromConfigurations.forEach((configurationDependency) => {
      const configurationToVerify = this.fromPropertyPathToType(configurationDependency);

      const configurationExists = availableInputAndConstantsData
        .includes(configurationToVerify);

      if (!configurationExists) {
        // eslint-disable-next-line max-len
        throw Error(`There is an error on the configuration: Unmet dependency from inputs or constants "${configurationToVerify}"`);
      }
    });

    this.dependencies.fromOutputs.forEach((outputDependency) => {
      const outputToVerify= this.fromPropertyPathToType(outputDependency);

      const outputExists = availableOutputFunctions
        .includes(outputToVerify);

      if (!outputExists) {
        throw Error(`There is an error on the configuration: Unmet dependency from outputs "${outputToVerify}"`);
      }
    });
  }

  /**
   * This method should be used to remove properties access when you just need the
   * plain type of the string.
   *
   * This does not remove the initial path indication, such as the "!" or "%"
   */
  private fromPropertyPathToType (fullPath : string) : string {
    const firstAccessIndex = fullPath.indexOf(".");

    if (firstAccessIndex <= 1) {
      return fullPath;
    }

    return fullPath.substring(0, firstAccessIndex);
  }

  private checkInternalFunctionsDependencies () : void {
    this.dependencies.internal.forEach((internalDependencyName) => {
      const functionExists = checkInternalFunctionExist(internalDependencyName);

      if (!functionExists) {
        throw Error (`Required internal function "${internalDependencyName}" does not exist internally`);
      }
    });
  }

  private checkSchemaFunctionsDependencies () : void {
    this.dependencies.fromSchemas.forEach((schemaDependecy) => {
      const requiredSchema = schemaDependecy.substring(1,
        schemaDependecy.lastIndexOf("@"),
      );

      if (!this.schemas.has(requiredSchema)) {
        throw Error(`Required Schema "${requiredSchema}" was not provided in the configuration`);
      }

      const requiredFunction = schemaDependecy
        .substring(schemaDependecy.lastIndexOf("@") + 1);

      if (!(requiredFunction in SchemasFunctions)) {
        throw Error(`The schema operation required "${requiredFunction}" at "${schemaDependecy}" does not exist`);
      }
    });
  }

  private checkExternalRequiredFunctions () : void {
    this.dependencies.external.forEach((externalDependency) => {
      externalFunctionIsLoaded(externalDependency);
    });
  }
}
