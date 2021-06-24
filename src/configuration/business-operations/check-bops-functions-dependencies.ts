import { BusinessOperation } from "@api/configuration/business-operations/business-operation";
import { Schema } from "@api/configuration/schemas/schema";
import { externalFunctionIsLoaded } from "@api/external-functions/domain/external-function-is-loaded";
import { checkInternalFunctionExist } from "@api/internal-functions";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";

interface BopsDependencies {
  fromSchemas : string[];
  internal : string[];
  fromConfigurations : string[]; // From inputs/constants
  fromOutputs : string[];
  external : string[];
  fromBops : string[];
}

/**
 * Command to check if the dependencies for a given configuration are met
 *
 * Dependencies are code or information that resides outside the configuration for
 * the meta-system, be it a runtime attribute or a function described at it.
 */
export class CheckBopsFunctionsDependencies {
  private schemas : Set<string> = new Set();
  private bops : Set<string> = new Set();
  private businessOperation : BusinessOperation;
  private dependencies : BopsDependencies;

  public get bopsDependencies () : BopsDependencies {
    return this.dependencies;
  }

  public constructor (
    allSchemas : Schema[],
    allBusinessOperations : BusinessOperation[],
    currentBusinessOperation : BusinessOperation,
  ) {
    allSchemas.forEach((schema) => {
      this.schemas.add(schema.name);
    });

    allBusinessOperations.forEach((Bop) => {
      this.bops.add(Bop.name);
    });

    this.businessOperation = currentBusinessOperation;
    this.extractDependencies();
  }

  public CheckAllDependencies () : boolean {
    const results = [
      this.checkConfigurationalDependenciesMet(),
      this.checkInternalFunctionsDependenciesMet(),
      this.checkSchemaFunctionsDependenciesMet(),
      this.checkExternalRequiredFunctionsMet(),
      this.checkOutputDependencyMet(),
    ];

    return !results.includes(false);
  }

  // eslint-disable-next-line max-lines-per-function
  private extractDependencies () : void {
    const externalDependencies = [];
    const internalDependencies = [];
    const outputsDependencies = [];
    const schemasDependencies = [];
    const configurationalDependencies = [];
    const bopsDependencies = [];

    // eslint-disable-next-line max-lines-per-function
    this.businessOperation.configuration.forEach((bopsFunctionConfig) => {
      const typeChar = bopsFunctionConfig.moduleRepo.charAt(0);

      const typeCharsEnum = {
        internal: "#",
        schema: "@",
        bops: "+",
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

      if (typeChar === typeCharsEnum.bops) {
        return bopsDependencies.push(bopsFunctionConfig.moduleRepo);
      }

      externalDependencies.push(bopsFunctionConfig.moduleRepo);
    });

    this.dependencies = {
      internal: internalDependencies,
      external: externalDependencies,
      fromOutputs: outputsDependencies,
      fromSchemas: schemasDependencies,
      fromConfigurations: configurationalDependencies,
      fromBops: bopsDependencies,
    };
  }

  // eslint-disable-next-line max-lines-per-function
  public checkConfigurationalDependenciesMet () : boolean {
    // This method should only check for the presence of the field, thus, should disregard types
    // and property accesses such as "!data.property", needing only to verify the "!data" part
    const availableInputAndConstantsData = [];

    Object.keys(this.businessOperation.input).forEach((inputName) => {
      availableInputAndConstantsData.push(`${inputName}`);
    });

    this.businessOperation.constants.forEach((constantDeclaration) => {
      availableInputAndConstantsData.push(`${constantDeclaration.name}`);
    });

    let result = true;

    for (const configurationDependency of this.dependencies.fromConfigurations) {
      const configurationToVerify = this.fromPropertyPathToType(configurationDependency);
      result = availableInputAndConstantsData.includes(configurationToVerify);
      if (!result) { return false; }
    }

    return true;
  }

  public checkOutputDependencyMet () : boolean {
    let result = true;
    const availableOutputFunction = "%output";

    for (const outputDependency of this.dependencies.fromOutputs) {
      result = outputDependency === availableOutputFunction;
      if (!result) { return false; }
    }

    return true;
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

  public checkInternalFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const internalDependencyName of this.dependencies.internal) {
      result = checkInternalFunctionExist(internalDependencyName);

      if (!result) { return false; }
    }

    return true;
  }

  public checkSchemaFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const schemaDependecy of this.dependencies.fromSchemas) {
      const requiredSchema = schemaDependecy.substring(1,
        schemaDependecy.lastIndexOf("@"),
      );

      const requiredFunction = schemaDependecy
        .substring(schemaDependecy.lastIndexOf("@") + 1);


      result = this.schemas.has(requiredSchema);
      if (!result) { return false; }

      result = (requiredFunction in SchemasFunctions);
      if (!result) { return false; }
    }

    return true;
  }

  public checkBopsFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const bopsDependency of this.dependencies.fromBops) {
      const requiredBop = bopsDependency.substring(1);

      result = this.bops.has(requiredBop);

      if (!result) { return false; }
    }

    return true;
  }

  private checkExternalRequiredFunctionsMet () : boolean {
    let result = true;

    for (const externalDependency of this.dependencies.external) {
      result = externalFunctionIsLoaded(externalDependency);

      if (!result) { return false; }
    }

    return true;
  }
}
