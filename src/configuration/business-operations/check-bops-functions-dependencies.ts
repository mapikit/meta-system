import { ProtocolFunctionManagerClass } from "../../bops-functions/function-managers/protocol-function-manager.js";
import { ExternalFunctionManagerClass } from "../../bops-functions/function-managers/external-function-manager.js";
import { InternalFunctionManagerClass } from "../../bops-functions/function-managers/internal-function-manager.js";
import { SchemasFunctions } from "../../schemas/domain/schemas-functions";
import { Schema } from "../schemas/schema";
import { BusinessOperation } from "./business-operation.js";
import { logger } from "../../common/logger/logger.js";

export interface BopsDependencies {
  fromSchemas : Array<{ functionName : string; schemaName : string; }>;
  internal : string[];
  fromConfigurations : string[]; // From inputs/constants
  fromOutputs : string[];
  external : Array<{ name : string; version : string; package ?: string }>;
  protocol : Array<{ name : string; version : string; package ?: string }>
  fromBops : string[];
  bopName : string;
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

  // eslint-disable-next-line max-lines-per-function, max-params
  public constructor (
    allSchemas : Schema[],
    allBusinessOperations : BusinessOperation[],
    currentBusinessOperation : BusinessOperation,
    private externalFunctionManager : ExternalFunctionManagerClass,
    private internalFunctionManager : InternalFunctionManagerClass,
    private protocolFunctionManager : ProtocolFunctionManagerClass,
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

  public checkAllDependencies () : boolean {
    const results = [
      this.checkConfigurationalDependenciesMet(),
      this.checkInternalFunctionsDependenciesMet(),
      this.checkSchemaFunctionsDependenciesMet(),
      this.checkExternalRequiredFunctionsMet(),
      this.checkOutputDependencyMet(),
      this.checkProtocolDependenciesMet(),
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
    const protocolsDependencies = [];
    const bopsDependencies = [];

    // eslint-disable-next-line max-lines-per-function
    this.businessOperation.configuration.forEach((bopsFunctionConfig) => {
      const type = bopsFunctionConfig.moduleType;

      const typesEnum = {
        internal: "internal",
        schema: "schemaFunction",
        protocol: "protocol",
        bops: "bop",
        outputs: "output",
        external: "external",
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

      if (type === typesEnum.bops) {
        return bopsDependencies.push(bopsFunctionConfig.moduleName);
      }

      if(type === typesEnum.external) {
        return externalDependencies.push({
          name: bopsFunctionConfig.moduleName,
          version: bopsFunctionConfig.version,
          package: bopsFunctionConfig.modulePackage,
        });
      }

      if (type === typesEnum.protocol) {
        // The modulePackage - for Protocols - is their identifier, not their name
        protocolsDependencies.push({
          name: bopsFunctionConfig.moduleName,
          version: bopsFunctionConfig.version,
          package: bopsFunctionConfig.modulePackage,
        });
      }
    });

    this.dependencies = {
      internal: internalDependencies,
      external: externalDependencies,
      fromOutputs: outputsDependencies,
      fromSchemas: schemasDependencies,
      fromConfigurations: configurationalDependencies,
      fromBops: bopsDependencies,
      protocol: protocolsDependencies,
      bopName: this.businessOperation.name,
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
      result = this.internalFunctionManager.functionIsInstalled(internalDependencyName);

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

      result = (requiredFunction in SchemasFunctions);
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

  public checkExternalRequiredFunctionsMet () : boolean {
    let result = true;

    for (const externalDependency of this.dependencies.external) {
      result = this.externalFunctionManager
        .functionIsInstalled(externalDependency.name, externalDependency.package);

      if (!result) {
        logger.error(
          `[Dependency Check] Unmet external dependency: "${externalDependency.name}@${externalDependency.version}"`,
        );
        return false;
      }
    }

    return true;
  }

  public checkProtocolDependenciesMet () : boolean {
    let result = true;

    for (const protocolDependency of this.dependencies.protocol) {
      result = this.protocolFunctionManager
        // The package for protocols in BOps **IS** the protocol identifier
        .get(`${protocolDependency.package}.${protocolDependency.name}`) !== undefined;

      if (!result) {
        logger.error(
          // eslint-disable-next-line max-len
          `[Dependency Check] Unmet protocol dependency: "${protocolDependency.name}@${protocolDependency.version}.${protocolDependency.name}"`,
        );
        return false;
      }
    }

    return result;
  }
}
