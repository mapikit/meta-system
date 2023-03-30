import { FunctionsInstaller, ModuleKind } from "../../bops-functions/installation/functions-installer.js";
import { ProtocolDescriptionValidation } from "../../bops-functions/installation/protocol-configuration-validation";
import { ProtocolFileSystem } from "../../bops-functions/installation/protocol-file-system";
import { runtimeDefaults } from "../../configuration/runtime-config/defaults.js";
import { FunctionManager } from "@meta-system/meta-function-helper";
import Path from "path";
import {
  MetaProtocol,
  DBProtocol,
  validateProtocolConfiguration,
  BuiltMetaProtocolDefinition,
} from "@meta-system/meta-protocol-helper";
import { Protocol } from "../../configuration/protocols/protocols";
import { isDbProtocol } from "../../configuration/protocols/is-db-protocol";
import { SchemaType } from "../../configuration/schemas/schemas-type.js";
import { environment } from "../../common/execution-env.js";

type DualNewable = DBProtocolNewable | MetaProtocolNewable;

export type DBProtocolNewable = new (arg1 : unknown, arg2 : SchemaType[]) => DBProtocol<unknown>;
export type MetaProtocolNewable = new (arg1 : unknown, arg2 : FunctionManager) => MetaProtocol<unknown>;

export class ProtocolFunctionManagerClass implements FunctionManager {
  private functionMap : Map<string, Function>= new Map();
  private descriptionsMap : Map<string, BuiltMetaProtocolDefinition> = new Map();
  private nameDescriptionMap : Map<string, BuiltMetaProtocolDefinition> = new Map();
  private instanceMap : Map<string, MetaProtocol<unknown> | DBProtocol<unknown>> = new Map();
  private initializedSet : Set<string> = new Set();

  public constructor (
    private functionsInstaller = new FunctionsInstaller(environment.constants.installDir),
    private protocolFileSystem = new ProtocolFileSystem(
      environment.constants.installDir,
      runtimeDefaults.externalProtocolConfigFileName,
    ),
  ) {}

  public getAvailableDbProtocolsNames () : string[] {
    const availableDbProtocols : string[] = [];
    this.instanceMap.forEach((protocol, name) => {
      if(isDbProtocol(protocol)) availableDbProtocols.push(name);
    });
    return availableDbProtocols;
  }

  public async initializeDbProtocol (protocolIdentifier : string) : Promise<void> {
    const protocol = this.getProtocolInstance(protocolIdentifier);

    if (!isDbProtocol(protocol)) { return; }
    if (this.initializedSet.has(protocolIdentifier)) { return;}

    await (protocol as DBProtocol<unknown>).initialize();
    this.initializedSet.add(protocolIdentifier);
  }

  public get (protocolIdentifierAndFunction : string) : Function {
    return this.functionMap.get(protocolIdentifierAndFunction);
  }

  public getProtocolDescription (protocolIdentifier : string) : BuiltMetaProtocolDefinition {
    return this.descriptionsMap.get(protocolIdentifier);
  }

  public getProtocolDescriptionFromName (protocol : string) : BuiltMetaProtocolDefinition {
    return this.nameDescriptionMap.get(protocol);
  }

  public async installProtocol (protocolInfo : Protocol) : Promise<void> {
    await this.functionsInstaller.install(protocolInfo.protocol, protocolInfo.protocolVersion, ModuleKind.NPM);
    const protocolDescription = await this.protocolFileSystem.getDescriptionFile(protocolInfo.protocol);

    const path = Path.join(environment.constants.installDir as string, "node_modules", protocolInfo.protocol);
    await validateProtocolConfiguration(protocolDescription, path, protocolInfo.isDbProtocol);

    const configValidation = await new ProtocolDescriptionValidation(
      protocolDescription, path, protocolInfo.isDbProtocol).validate();

    const config = await configValidation.getPackageConfiguration();

    this.descriptionsMap.set(protocolInfo.identifier, config);
    this.nameDescriptionMap.set(protocolInfo.protocol, config);
  }

  public async getProtocolNewable (protocolName : string) : Promise<DualNewable> {
    const config = this.nameDescriptionMap.get(protocolName);

    return this.protocolFileSystem.importClass(protocolName, config.entrypoint, config.className);
  }

  public protocolIsInstantiated (protocolIdentifier : string) : boolean {
    return this.instanceMap.get(protocolIdentifier) !== undefined;
  }

  public addProtocolInstance (
    protocolInstance : MetaProtocol<unknown> | DBProtocol<unknown>, protocolIdentifier : string) : void {
    this.instanceMap.set(protocolIdentifier, protocolInstance);
  }

  public getProtocolInstance (identifier : string) : MetaProtocol<unknown> | DBProtocol<unknown> {
    return this.instanceMap.get(identifier);
  }

  public addFunction (functionName : string, protocolIdentifier : string) : void {
    if(!this.protocolIsInstantiated(protocolIdentifier)) {
      throw Error(`Protocol function "${functionName}" from protocol id "${protocolIdentifier}" was required `
        + `in the config but such protocol is not installed \n\tAvailable: ${Array.from(this.instanceMap.keys())}`);
    }
    const instance = this.getProtocolInstance(protocolIdentifier);
    const protocolInstanceFunction = instance.getProtocolPublicMethods()[functionName];

    if (protocolInstanceFunction === undefined) {
      throw Error(`Protocol function "${functionName}" was required in the config but the protocol`
      + ` "${protocolIdentifier}" contains no such function. Available functions are: `
      + Object.keys(instance.getProtocolPublicMethods()),
      );
    }

    this.functionMap.set(`${protocolIdentifier}.${functionName}`, protocolInstanceFunction);
  }

  /* FOR TESTING PURPOSES ONLY */
  public flush () : void {
    this.functionMap = new Map();
    this.descriptionsMap = new Map();
    this.nameDescriptionMap = new Map();
    this.instanceMap = new Map();
    this.initializedSet = new Set();
  }
}

export const protocolFunctionManagerSingleton = new ProtocolFunctionManagerClass();
