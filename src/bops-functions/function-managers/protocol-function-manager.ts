import { FunctionsInstaller, ModuleKind } from "../../bops-functions/installation/functions-installer";
import { ProtocolDescriptionValidation } from "../../bops-functions/installation/protocol-configuration-validation";
import { ProtocolFileSystem } from "../../bops-functions/installation/protocol-file-system";
import { runtimeDefaults } from "../../configuration/runtime-config/defaults";
import { FunctionManager } from "@meta-system/meta-function-helper";
import Path from "path";
import {
  MetaProtocol,
  DBProtocol,
  validateProtocolConfiguration,
  MetaProtocolDefinition,
} from "@meta-system/meta-protocol-helper";

export class ProtocolFunctionManagerClass implements FunctionManager {
  private functionMap : Map<string, Function>= new Map();
  private descriptionsMap : Map<string, MetaProtocolDefinition> = new Map();
  private instanceMap : Map<string, MetaProtocol<unknown> | DBProtocol<unknown>> = new Map();

  public constructor (
    private functionsInstaller = new FunctionsInstaller(runtimeDefaults.externalFunctionInstallFolder),
    private protocolFileSystem = new ProtocolFileSystem(
      runtimeDefaults.externalFunctionInstallFolder,
      runtimeDefaults.externalProtocolConfigFileName,
    ),
  ) {}

  public get (protocolNameAndFunction : string) : Function {
    return this.functionMap.get(protocolNameAndFunction);
  }

  public getProtocolDescription (protocolName : string) : MetaProtocolDefinition {
    return this.descriptionsMap.get(protocolName);
  }

  public async installProtocol (protocolName : string, version = "latest") : Promise<void> {
    await this.functionsInstaller.install(protocolName, version, ModuleKind.NPM);
    const protocolDescription = await this.protocolFileSystem.getDescriptionFile(protocolName);

    const path = Path.join(runtimeDefaults.externalFunctionInstallFolder, "node_modules", protocolName);
    const CHANGE_ME = false; // TODO change this to db protocols
    await validateProtocolConfiguration(protocolDescription, path, CHANGE_ME);

    const configValidation = await new ProtocolDescriptionValidation(protocolDescription).validate(path);

    this.descriptionsMap.set(protocolName, await configValidation.getPackageConfiguration());
  }

  public async getProtocolNewable (protocolName : string)
    : Promise<new (arg1 : unknown, arg2 : FunctionManager) => MetaProtocol<unknown>> {
    const config = this.descriptionsMap.get(protocolName);

    return this.protocolFileSystem.importClass(protocolName, config.entrypoint, config.className);
  }

  public protocolIsInstantiated (protocolName : string) : boolean {
    return this.instanceMap.get(protocolName) !== undefined;
  }

  public addProtocolInstance (
    protocolInstance : MetaProtocol<unknown> | DBProtocol<unknown>, protocolName : string) : void {
    this.instanceMap.set(protocolName, protocolInstance);
  }

  public getProtocolInstance (name : string) : MetaProtocol<unknown> | DBProtocol<unknown> {
    return this.instanceMap.get(name);
  }

  public addFunction (functionName : string, protocolName : string) : void {
    if(!this.protocolIsInstantiated(protocolName)) {
      throw Error(`Protocol function "${functionName}" from protocol "${protocolName}" was required in the config `
        + "but such protocol is not installed");
    }
    const instance = this.instanceMap.get(protocolName);
    const protocolInstanceFunction = instance.getProtocolPublicMethods()[functionName];

    if (protocolInstanceFunction === undefined) {
      throw Error(`Protocol function "${functionName}" was required in the config but the protocol`
      + ` "${protocolName}" contains no such function. Available functions are: `
      + Object.keys(instance.getProtocolPublicMethods()),
      );
    }

    this.functionMap.set(`${protocolName}.${functionName}`, protocolInstanceFunction);
  }
}

export const protocolFunctionManagerSingleton = new ProtocolFunctionManagerClass();
