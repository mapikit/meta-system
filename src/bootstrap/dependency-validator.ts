import { ExternalFunctionManagerClass } from "../bops-functions/function-managers/external-function-manager";
import { InternalMetaFunction } from "../bops-functions/internal-meta-function";
import {
  BopsConfigurationEntry,
  BusinessOperations,
  Dependency,
  ModuleType } from "../configuration/business-operations/business-operations-type";
import { ConfigurationType } from "../configuration/configuration-type";
import { CustomType, ObjectDefinition } from "meta-function-helper";
import { schemaFunctionInfoMap } from "../schemas/application/schema-functions-info";
import { VariableContext } from "../bops-functions/bops-engine/variables/variables-context";
import { ProtocolFunctionManagerClass } from "bops-functions/function-managers/protocol-function-manager";
import clone from "just-clone";
import { InternalFunctionManagerClass } from "bops-functions/function-managers/internal-function-manager";
import chalk from "chalk";

type FunctionInfoType = InternalMetaFunction | BusinessOperations;

export class DependencyPropValidator {
  private workingBop : BusinessOperations;
  private getHeader : (errorType : string) => string;
  private typeCheckingLevel = 1;
  // eslint-disable-next-line max-params
  constructor (
    private systemConfig : ConfigurationType,
    private internalManager : InternalFunctionManagerClass,
    private externalManager : ExternalFunctionManagerClass,
    private protocolManager : ProtocolFunctionManagerClass,
  ) {};

  // eslint-disable-next-line max-lines-per-function
  public verifyAll () : void {
    console.log(chalk.greenBright("[Dependency Validation] Starting validation of all registered dependencies"));
    const typeSafeArgIndex = process.argv.indexOf("--type-check");
    if(typeSafeArgIndex > -1) {
      const selectedLevel = Number(process.argv[typeSafeArgIndex+1]);
      if(typeof selectedLevel !== "number" || selectedLevel < 0) {
        throw Error("Invalid type-check value; Must be a number between 0-4");
      }
      this.typeCheckingLevel = selectedLevel > 4 ? 4 : selectedLevel;
    }
    this.systemConfig.businessOperations.forEach(bop => {
      this.workingBop = bop;
      bop.configuration.forEach(module => {
        this.getHeader = (errorType : string) : string =>
          chalk.yellowBright(`[${errorType} in BOp "${bop.name}" @ key ${module.key} (${module.moduleName})]\n`);

        this.requiredInputsFullfilled(module);
        module.dependencies.forEach(dependency => {
          if(dependency.originPath === undefined) return;
          this.validateIO(dependency, module, bop);
          if(this.typeCheckingLevel > 0) this.validateTypes(dependency, module, bop);
        });
      });
    });
    console.log(chalk.greenBright("[Dependency Validation] Finished validating dependencies"));
  }

  private getCustomTypes (info : FunctionInfoType) : CustomType[] {
    if(info["customTypes"] !== undefined) return info["customTypes"];
    const customTypes = (info as BusinessOperations).customObjects?.map(object => {
      const asCustomType : CustomType = { name: object.name, type: object.properties };
      return asCustomType;
    });
    return customTypes;
  }

  // eslint-disable-next-line max-lines-per-function
  private validateTypes (dependency : Dependency, module : BopsConfigurationEntry, bop : BusinessOperations) : void {
    const moduleInfo = this.getFunctionInfo(module);
    if(module.moduleType !== "output") {
      enum of { origin, target }
      let types : [string, string];
      try {
        switch (typeof dependency.origin) {
          case "number":
            const refersTo = bop.configuration.find(mod => mod.key == dependency.origin);
            const referredInfo = this.getFunctionInfo(refersTo);
            types = this.getModularTypes(referredInfo, moduleInfo, dependency);
            break;
          case "string":
            types = this.getStaticTypes(dependency, moduleInfo);
            break;
        }
      } catch (e) {
        console.log(chalk.redBright("[Dependency Validation] Failed to validate types - Aborting! " +
        `@ ${bop.name} -> ${module.key} (${module.moduleName}) Dependency: [${JSON.stringify(dependency)}]`));
        throw e;
      }
      if(types[of.origin] === types[of.target] || types[of.target] === "any") return;
      if(types.every(type => type.startsWith("array")) && types[of.target].endsWith("any")) return;

      if(this.typeCheckingLevel === 1) {
        if(types.includes("unknown")) return;
        return console.log(this.getHeader("Type Error"),
          `  >> Possibly invalid type from ${dependency.origin} "${dependency.originPath}"\n`,
          `     :: ${types[of.origin]} type may not be assignable to ${types[of.target]}`,
        );
      }

      if(this.typeCheckingLevel === 2) {
        return console.log(this.getHeader("Type Error"),
          `  >> Possibly invalid type from ${dependency.origin} "${dependency.originPath}"\n`,
          `     :: ${types[of.origin]} type may not be assignable to ${types[of.target]}`,
        );
      }

      if(this.typeCheckingLevel === 3) {
        if(types.includes("unknown")) {
          return console.log(this.getHeader("Type Error"),
            `  >> Possibly invalid type from ${dependency.origin} "${dependency.originPath}"\n`,
            `     :: ${types[of.origin]} type may not be assignable to ${types[of.target]}`,
          );
        } else {
          throw new Error(this.getHeader("Type Error") +
            `  >> Invalid type from ${dependency.origin} "${dependency.originPath}"\n` +
            `     :: ${types[of.origin]} type is not be assignable to ${types[of.target]}`);
        }
      }

      if(this.typeCheckingLevel === 4) {
        throw Error(this.getHeader("Type Error") +
          `  >> Invalid type from ${dependency.origin} "${dependency.originPath}"\n` +
          `     :: ${types[of.origin]} type is not be assignable to ${types[of.target]}`,
        );
      }
    }
  }

  private requiredInputsFullfilled (module : BopsConfigurationEntry) : void {
    const functionInfo = this.getFunctionInfo(module);
    if(functionInfo === undefined) return;
    const inputs = this.getFunctionInput(functionInfo) ?? {};
    const requiredInputs : Array<string> = [];
    for(const input in inputs) {
      if(inputs[input].required) requiredInputs.push(input);
    }
    const configuredInputs = module.dependencies.map(dependency => dependency.targetPath?.split(".")[0]);

    const isFullfilled = requiredInputs.every(input => configuredInputs.includes(input));
    if(!isFullfilled) {
      console.log(this.getHeader("Missing Required Inputs"),
        `  >> Required inputs are ${requiredInputs} but only ${configuredInputs} were given`);
    }
  }

  private getStaticDependencyType (dependency : Dependency) : string {
    const origin = dependency.origin as string;
    const originPath = dependency.originPath.split(".");
    if(["input", "inputs"].includes(origin as string)) {
      return this.getPathType(this.workingBop.input, originPath, this.getCustomTypes(this.workingBop));
    } else {
      if(["constants", "constant"].includes(origin as string)) {
        return this.workingBop.constants.find(constant => constant.name === originPath[0]).type;
      }
      if(["variable", "variables"].includes(origin as string)) {
        return this.workingBop.variables.find(variable => variable.name === originPath[0]).type;
      }
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private getStaticTypes (dependency : Dependency, inputInfo : FunctionInfoType) : [string, string] {
    const targetPath = dependency.targetPath.split(".");
    const targetInputInfo = this.getFunctionInput(inputInfo);
    const targetType = this.getPathType(targetInputInfo, targetPath, this.getCustomTypes(inputInfo));

    const originType = this.getStaticDependencyType(dependency);

    return [originType, targetType];
  }

  private getFunctionOutput (functionInfo : FunctionInfoType) : ObjectDefinition {
    if(functionInfo === undefined) return {};
    return functionInfo["outputData"] ?? functionInfo["output"] ?? {};
  }

  private getFunctionInput (functionInfo : FunctionInfoType) : ObjectDefinition {
    if(functionInfo === undefined) return {};
    return functionInfo["inputParameters"] ?? functionInfo["input"];
  }

  private getFunctionInfo (module : BopsConfigurationEntry) : FunctionInfoType {
    const moduleType = module.moduleType;
    return this.infoResolver[moduleType](module.moduleName, module.modulePackage);
  };

  private validateIO (dependency : Dependency, module : BopsConfigurationEntry, bop : BusinessOperations) : void {
    const moduleInfo = this.getFunctionInfo(module);
    if(typeof dependency.origin === "number") {
      const refersTo = bop.configuration.find(mod => mod.key == dependency.origin);
      const referredInfo = this.getFunctionInfo(refersTo);
      this.isOutputAvailable(dependency, referredInfo);
    };
    if(module.moduleType !== "output") {
      this.isInputAvailable(dependency, moduleInfo);
    }
  }

  private isOutputAvailable (dependency : Dependency, functionInfo : FunctionInfoType) : void {
    if(functionInfo === undefined) return;
    const outputs = this.getFunctionOutput(functionInfo) ?? {};
    const originPathArray = dependency.originPath.split(".").slice(1);
    const moduleName = functionInfo["functionName"] ?? functionInfo["name"];
    if(originPathArray[0] === undefined) return;
    if(!Object.keys(outputs).includes(originPathArray[0])) {
      console.warn(
        this.getHeader("Origin Unavailable"),
        `  >> Requested property "${originPathArray[0]}" is not output of function "${moduleName}"` +
        ` (${dependency.origin})\n`,
        `     :: Available outputs are: ${Object.keys(outputs)}`,
      );
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private getPathType (definition : ObjectDefinition, pathArray : Array<string>, customTypes : CustomType[]) : string {
    const output = definition[pathArray[0]];
    if(output === undefined) return "unknown";
    if(output.type.startsWith("$")) {
      const subtype =
        this.systemConfig.schemas.find(schema => schema.name === output.type.slice(1))?.format ??
        customTypes.find(type => type.name === output.type.slice(1))?.type;
      output["subtype"] = subtype;
      output.type = "object";
    }
    if(output["subtype"] !== undefined) {
      if(output.type === "array") {
        return `array.${output["subtype"]}`;
      }

      if(typeof output["subtype"] === "string" && output["subtype"].startsWith("$")) {
        const referredSchema = this.systemConfig.schemas.find(schema => schema.name === output["subtype"].slice(1));
        output["subtype"] = referredSchema.format;
      }
      if(output.type === "object") return this.getPathType(output["subtype"], pathArray.slice(1), customTypes);
    }
    if(pathArray.length > 1 && output.type === "cloudedObject") return "unknown";
    return output.type;
  }

  // eslint-disable-next-line max-lines-per-function
  private getModularTypes (originInfo : FunctionInfoType, targetInfo : FunctionInfoType, dependency : Dependency)
    : [string, string] {
    const targetPath = dependency.targetPath.split(".");
    const targetInputInfo = this.getFunctionInput(targetInfo);
    const targetType = this.getPathType(targetInputInfo, targetPath, this.getCustomTypes(targetInfo));

    const originPath = dependency.originPath.split(".").slice(1);
    const originOutputInfo = this.getFunctionOutput(originInfo);
    const originType = this.getPathType(originOutputInfo, originPath, this.getCustomTypes(originInfo));

    return [originType, targetType];
  }

  private isInputAvailable (dependency : Dependency, functionInfo : FunctionInfoType) : void {
    if(functionInfo === undefined) return;
    const inputs = this.getFunctionInput(functionInfo) ?? {};
    const functionName = functionInfo["functionName"] ?? functionInfo["name"];
    const targetPath = dependency.targetPath.split(".");
    if(targetPath[0] === undefined) return;
    if(!Object.keys(inputs).includes(targetPath[0])) {
      console.log(this.getHeader("Input Unavailable"),
        `  >> Targeted property "${targetPath[0]}" is not input of function "${functionName}"\n`,
        `     :: Available inputs are: ${Object.keys(inputs)}`,
      );
    }
  }

  private infoResolver : { [type in ModuleType] :
    (name : string, packageName ?: string) => FunctionInfoType } = {
    "internal": (name) => {
      return this.internalManager.infoMap.get(name);
    },
    "external": (name, packageName) => {
      const externalInfo = this.externalManager.getFunctionInfo(name, packageName);
      return externalInfo;
    },
    "bop": (name) => {
      return this.systemConfig.businessOperations.find(bop => bop.name === name);
    },
    "protocol": (name, modulePackage) => {
      const protocolInfo = this.protocolManager.getProtocolDescription(modulePackage).packageDetails;
      const functionInfo = protocolInfo.functionsDefinitions.find(funct => funct.functionName === name);
      return functionInfo;
    },
    // eslint-disable-next-line max-lines-per-function
    "schemaFunction": (name, modulePackage) => {
      const resolvableParameters : Array<keyof InternalMetaFunction> = ["inputParameters", "outputData"];
      const schemaFunctionInfo = clone(schemaFunctionInfoMap.get(name));
      resolvableParameters.forEach(param => {
        Object.keys(schemaFunctionInfo[param]).forEach(key => {
          if(schemaFunctionInfo[param][key].type === "%entity") {
            schemaFunctionInfo[param][key].type = `$${modulePackage}`;
          }
          if(schemaFunctionInfo[param][key]["subtype"] === "%entity") {
            schemaFunctionInfo[param][key]["subtype"] = `$${modulePackage}`;
          }
        });
      });
      const referredSchema = this.systemConfig.schemas.find(schema => schema.name === modulePackage);
      schemaFunctionInfo.customTypes.push({
        name: modulePackage,
        type: referredSchema.format,
      });
      return schemaFunctionInfo;
    },
    "variable": (name) => {
      const resolvableParameters : Array<keyof InternalMetaFunction> = ["inputParameters", "outputData"];
      const info = clone(VariableContext.variablesInfo.get(name));
      resolvableParameters.forEach(param => {
        Object.keys(info[param]).forEach(key => {
          if(key === "%variableName") {
            delete info[param][key];
            this.workingBop.variables.forEach(variable => {
              info[param][variable.name] = { type: variable.type, required: false };
            });
          }
        });
      });
      return info;
    },
    "output": () => undefined,
  }
}
