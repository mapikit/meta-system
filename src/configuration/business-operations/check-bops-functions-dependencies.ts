import { BusinessOperation } from "./business-operation.js";
import { logger } from "../../common/logger/logger.js";
import { EntityBroker } from "../../broker/entity-broker.js";
import type { SchemaType } from "../schemas/schemas-type.js";
import type { BusinessOperationType } from "./business-operations-type.js";
import { Addon } from "../addon-type.js";

export interface BopsDependencies {
  fromSchemas : Array<{ functionName : string; schemaName : string; }>;
  fromAddons : Array<{ addonIdentifier : string; function : string }>
  internal : string[];
  fromConfigurations : string[]; // From inputs/constants
  fromOutputs : string[];
  fromBops : string[];
  bopName : string;
}

// TODO: Test
/**
 * Command to check if the dependencies for a given configuration are met
 *
 * Dependencies are code or information that resides outside the configuration for
 * the meta-system, be it a runtime attribute or a function described at it.
 */
export class CheckBopsFunctionsDependencies { // Perhaps rename to convey: Validate whole system dependencies (?)
  private schemas : Set<string> = new Set();
  private bops : Set<string> = new Set();
  private businessOperation : BusinessOperation;
  private dependencies : BopsDependencies;
  private addons : Set<string> = new Set();

  public get bopsDependencies () : BopsDependencies {
    return this.dependencies;
  }

  // eslint-disable-next-line max-lines-per-function, max-params
  public constructor (
    private readonly systemBroker : EntityBroker,
    private readonly functionsBroker : EntityBroker,
    checkingBopIdentifier : string,
  ) {
    const allSchemas : Array<SchemaType> = this.systemBroker.schemas.getAll();
    const allBusinessOperations : Array<BusinessOperationType> = this.systemBroker.businessOperations.getAll();
    const allAddons : Array<Addon> = this.systemBroker.addons.getAll();

    allSchemas.forEach((schema) => {
      this.schemas.add(schema.name);
    });

    allBusinessOperations.forEach((Bop) => {
      this.bops.add(Bop.identifier);
    });

    allAddons.forEach(addon => {
      this.addons.add(addon.identifier);
    });

    this.businessOperation = this.systemBroker.businessOperations.getBop(checkingBopIdentifier);
    this.extractDependencies();
  }

  public checkAllDependencies () : boolean {
    const results = [
      this.checkConfigurationalDependenciesMet(),
      this.checkInternalFunctionsDependenciesMet(),
      this.checkSchemaFunctionsDependenciesMet(),
      this.checkAddonsFunctionsDependenciesMet(),
      this.checkOutputDependencyMet(),
    ];

    return !results.includes(false);
  }

  // eslint-disable-next-line max-lines-per-function
  private extractDependencies () : void {
    const internalDependencies = [];
    const outputsDependencies = [];
    const schemasDependencies = [];
    const configurationalDependencies = [];
    const addonsDependencies = [];
    const bopsDependencies = [];

    // eslint-disable-next-line max-lines-per-function
    this.businessOperation.configuration.forEach((bopsFunctionConfig) => {
      const type = bopsFunctionConfig.moduleType;
      const typesEnum = {
        internal: "internal",
        schema: "schemaFunction",
        bops: "bop",
        outputs: "output",
        addon: "addon",
      };

      bopsFunctionConfig.dependencies.forEach((dependency) => {
        if (dependency.origin === "constant" || dependency.origin === "input") {
          configurationalDependencies.push(
            this.fromPropertyPathToType(dependency.originPath),
          );
        }
      });

      if (type === typesEnum.internal) {
        return internalDependencies.push(bopsFunctionConfig.moduleName);
      }

      if (type === typesEnum.outputs) {
        return outputsDependencies.push(bopsFunctionConfig.moduleName);
      }

      if (type === typesEnum.schema) {
        return schemasDependencies.push({
          functionName: bopsFunctionConfig.moduleName,
          schemaName: bopsFunctionConfig.modulePackage,
        });
      }

      if (type === typesEnum.addon) {
        return addonsDependencies.push({
          addonIdentifier: bopsFunctionConfig.modulePackage,
          function: bopsFunctionConfig.moduleName,
        });
      }

      if (type === typesEnum.bops) {
        return bopsDependencies.push(bopsFunctionConfig.moduleName);
      }

    });


    this.dependencies = {
      internal: internalDependencies,
      fromOutputs: outputsDependencies,
      fromSchemas: schemasDependencies,
      fromConfigurations: configurationalDependencies,
      fromBops: bopsDependencies,
      fromAddons: addonsDependencies,
      bopName: this.businessOperation.identifier,
    };

  }

  // eslint-disable-next-line max-lines-per-function
  public checkAddonsFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const addonDependency of this.dependencies.fromAddons) {
      const requiredAddon = addonDependency.addonIdentifier;
      const requiredFunction = addonDependency.function;

      result = this.addons.has(requiredAddon);
      if (!result) {
        logger.error(`[Dependency Check] Unmet Addon dependency: "${requiredAddon}" - Missing Addon`);
        return false;
      }

      result = this.functionsBroker.addonsFunctions.getAddonFunction(requiredAddon, requiredFunction);
      if (!result) {
        const available = this.functionsBroker.addonsFunctions.getFromIdentifier(requiredAddon);
        logger.error(`[Dependency Check] Unmet Addon function dependency: "${requiredFunction}" - Missing Function\n` +
          `\t Available are: ${available.map(funct => funct.functionName).join(", ")}`,
        );
        return false;
      }
    }

    return true;
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
      if (!result) {
        logger.error(`[Dependency Check] Unmet Inputs/Constants dependency: "${configurationDependency}"`);
        return false;
      }
    }

    return true;
  }

  public checkOutputDependencyMet () : boolean {
    let result = true;
    const availableOutputFunction = "output";

    for (const outputDependency of this.dependencies.fromOutputs) {
      result = outputDependency === availableOutputFunction;
      if (!result) {
        logger.error(`[Dependency Check] Unmet output dependency: "${outputDependency}"`);
        return false;
      }
    }

    return true;
  }

  /**
   * This method should be used to remove properties access when you just need the
   * plain type of the string.
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
      result = this.functionsBroker.internalFunctions.getFunction(internalDependencyName);

      if (!result) {
        logger.error(`[Dependency Check] Unmet internal dependency: "${internalDependencyName}"`);
        return false;
      }
    }

    return true;
  }

  // eslint-disable-next-line max-lines-per-function
  public checkSchemaFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const schemaDependecy of this.dependencies.fromSchemas) {
      const requiredSchema = schemaDependecy.schemaName;
      const requiredFunction = schemaDependecy.functionName;

      result = this.schemas.has(requiredSchema);
      if (!result) {
        logger.error(`[Dependency Check] Unmet schema dependency: "${requiredSchema}" - Missing Schema`);
        return false;
      }

      result = this.functionsBroker.schemaFunctions.getSchemaFunction(requiredFunction, requiredSchema);
      if (!result) {
        logger.error(`[Dependency Check] Unmet Schema function dependency: "${requiredFunction}" - Missing Function`);
        return false;
      }
    }

    return true;
  }

  public checkBopsFunctionsDependenciesMet () : boolean {
    let result = true;

    for (const bopsDependency of this.dependencies.fromBops) {
      result = this.bops.has(bopsDependency);

      if (!result) {
        logger.error(`[Dependency Check] Unmet BOp dependency: "${bopsDependency}"`);
        return false;
      }
    }

    return true;
  }
}
