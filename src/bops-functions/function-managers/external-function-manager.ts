
import { MetaPackageDescriptionValidation } from "../../bops-functions/installation/packages-configuration-validation";
import { BuiltMetaPackage, FunctionManager, MetaFunction } from "@meta-system/meta-function-helper";
import { runtimeDefaults } from "../../configuration/runtime-config/defaults";
import { FunctionFileSystem } from "../installation/function-file-system";
import { MetaFunctionDescriptionValidation } from "../installation/functions-configuration-validation";
import { FunctionsInstaller, ModuleKind } from "../installation/functions-installer";


export class ExternalFunctionManagerClass implements FunctionManager {
  private functionMap : Map<string, Function> = new Map();
  private infoMap : Map<string, MetaFunction> = new Map();

  public constructor (
    private functionsInstaller = new FunctionsInstaller(runtimeDefaults.externalFunctionInstallFolder),
    private functionFileSystem = new FunctionFileSystem(
      runtimeDefaults.externalFunctionInstallFolder,
      runtimeDefaults.externalFunctionConfigFileName,
      runtimeDefaults.externalPackageConfigFileName,
    ),
  ) { }

  public get (functionName : string) : Function {
    return this.functionMap.get(functionName);
  }

  // eslint-disable-next-line max-lines-per-function
  public async add (functionName : string, functionVersion = "latest", packageName ?: string) : Promise<void> {
    await this.functionsInstaller.install(packageName ?? functionName, functionVersion, ModuleKind.NPM);
    const moduleType = packageName === undefined ? "function" : "package";
    const fileDescriptionMode = packageName === undefined ? functionName : packageName;
    const moduleConfigString = await this.functionFileSystem.getDescriptionFile(fileDescriptionMode, moduleType);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moduleConfig = packageName === undefined ?
      new MetaFunctionDescriptionValidation(moduleConfigString).validate().getFunctionConfiguration() :
      await (await new MetaPackageDescriptionValidation(moduleConfigString).validate())
        .getPackageConfiguration();

    // Only populated if the module is a function
    const functionLocation : string | undefined = moduleConfig["mainFunction"];

    const functionDeclaration = await this.functionFileSystem
      .import(fileDescriptionMode, moduleConfig.entrypoint, functionLocation);

    const info = moduleType === "package" ?
      this.getMetaFunctionFromMetaPackage(moduleConfig as BuiltMetaPackage, functionName) :
      (moduleConfig as MetaFunction);
    this.infoMap.set(packageName ? `${packageName}.${functionName}` : functionName, info);
    this.addFunctionsToMap(functionName, functionDeclaration, packageName);
  }

  private getMetaFunctionFromMetaPackage (builtMetaPackage : BuiltMetaPackage, functionName : string) : MetaFunction {
    const functionDefinition = builtMetaPackage.functionsDefinitions.find(funct => funct.functionName === functionName);

    const result : MetaFunction = {
      "description": builtMetaPackage.description,
      "version": builtMetaPackage.version,
      "functionName": functionName,
      "entrypoint": builtMetaPackage.entrypoint,
      "mainFunction": "",
      ...functionDefinition,
    };

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private addFunctionsToMap (
    name : string,
    input : Function | Record<string, Function>,
    packageName ?: string,
  ) : void {
    if (typeof input === "function") {
      this.functionMap.set(name, input);

      return;
    }

    const functionDeclaration = input[name] ?? input.default[name];

    if (functionDeclaration === undefined) {
      throw Error(`[BOPs Function] ERROR - Misconfigured package "${packageName}". `
      + `Function "${name}" not found!`);
    }

    this.functionMap.set(`${packageName}.${name}`, functionDeclaration);
  }

  public functionIsInstalled (name : string, packageName ?: string) : boolean {
    if (packageName !== undefined) {
      return this.functionMap.get(`${packageName}.${name}`) !== undefined;
    }

    return this.functionMap.get(name) !== undefined;
  }

  public getFunctionInfo (functionName : string, packageName ?: string) : MetaFunction {
    const fullName = packageName !== undefined ? `${packageName}.${functionName}` : functionName;
    return this.infoMap.get(fullName);
  }
}

export const externalFunctionManagerSingleton = new ExternalFunctionManagerClass();
