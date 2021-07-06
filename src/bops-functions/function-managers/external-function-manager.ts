import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { runtimeDefaults } from "@api/configuration/runtime-config/defaults";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { MetaFunctionDescriptionValidation } from "@api/bops-functions/installation/functions-configuration-validation";
import { MetaFunction } from "meta-function-helper";


export class ExternalFunctionManagerClass implements FunctionManager {
  private functionMap : Map<string, Function> = new Map();
  private fucntionConfigurationMap : Map<string, MetaFunction> = new Map();

  public constructor (
    private functionsInstaller = new FunctionsInstaller(runtimeDefaults.externalFunctionInstallFolder),
    private functionFileSystem = new FunctionFileSystem(
      runtimeDefaults.externalFunctionInstallFolder,
      runtimeDefaults.externalFunctionConfigFileName,
    ),
  ) { }

  public get (functionName : string) : Function {
    return this.functionMap.get(functionName);
  }

  public getConfiguration (functionName : string) : MetaFunction {
    return this.fucntionConfigurationMap.get(functionName);
  }

  public async add (functionName : string, functionVersion = "latest") : Promise<void> {
    await this.functionsInstaller.install(functionName, functionVersion, ModuleKind.NPM);
    const functionConfigString = await this.functionFileSystem.getFunctionDescriptionFile(functionName);
    const functionConfig = new MetaFunctionDescriptionValidation(functionConfigString)
      .validate()
      .getFunctionConfiguration();

    const functionDeclaration = await this.functionFileSystem
      .importMain(functionName, functionConfig.entrypoint, functionConfig.mainFunction);

    this.functionMap.set(functionName, functionDeclaration);
    this.fucntionConfigurationMap.set(`${functionName}@${functionVersion}`, functionConfig);
  }

  public functionIsInstalled (functionName : string, functionVersion = "latest") : boolean {
    return this.fucntionConfigurationMap.get(`${functionName}@${functionVersion}`) !== undefined;
  }
}

export const externalFunctionManagerSingleton = new ExternalFunctionManagerClass();
