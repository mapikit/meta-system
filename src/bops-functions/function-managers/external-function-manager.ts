
import { MetaFunction } from "meta-function-helper";
import { runtimeDefaults } from "../../configuration/runtime-config/defaults";
import { FunctionFileSystem } from "../installation/function-file-system";
import { MetaFunctionDescriptionValidation } from "../installation/functions-configuration-validation";
import { FunctionsInstaller, ModuleKind } from "../installation/functions-installer";
import { FunctionManager } from "./function-manager";


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
