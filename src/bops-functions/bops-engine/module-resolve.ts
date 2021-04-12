import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { FunctionsInstaller, ModuleKind } from "@api/bops-functions/installation/functions-installer";
import { BopsConfigurationEntry } from "@api/configuration-de-serializer/domain/business-operations-type";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { SchemasFunctions } from "@api/schemas/domain/schemas-functions";
import { MetaFunction, OutputData } from "meta-function-helper";
import { schemaFunctionsFolders } from "@api/bops-functions/bops-engine/schema-functions-map";

export type MappedFunction = Map<string, Function>;

interface ModuleManagerFileSystem {
  installer : FunctionsInstaller;
  schemaFunctions : FunctionFileSystem;
  externalFunctions : FunctionFileSystem;
}

export class ModuleManager {
  private schemasManager : SchemasManager;
  public readonly mappedOutputs : Map<string, OutputData[]>
  private files : ModuleManagerFileSystem;

  constructor (options : {
    SchemaManager : SchemasManager;
    FunctionsFolder : string;
    BOpsConfigFile : string;
  }) {
    const schemaFunctionsLocation = "src/schemas/application/schema-bops-funtions";
    this.files = {
      installer : new FunctionsInstaller(options.FunctionsFolder),
      externalFunctions: new FunctionFileSystem(process.cwd(), options.FunctionsFolder, options.BOpsConfigFile),
      schemaFunctions: new FunctionFileSystem(process.cwd(), schemaFunctionsLocation, options.BOpsConfigFile),
    };

    this.schemasManager = options.SchemaManager;
    this.mappedOutputs = new Map<string, OutputData[]>();
  }

  // eslint-disable-next-line max-lines-per-function
  private async resolveModule (moduleRepo : string, moduleVersion = "latest") : Promise<Function> {
    const moduleName = moduleRepo.slice(1);
    switch(moduleRepo[0]) {
      case "@":
        const [schema, operation] = moduleName.split("@");
        if(!Object.keys(SchemasFunctions).includes(operation)) throw new Error(`No such operation "${operation}"`);

        const functionLocation = schemaFunctionsFolders.get(operation);
        const metaFunction = await this.files.schemaFunctions.getFunctionDescriptionFile(functionLocation);
        const schemaFunctionConfig = JSON.parse(metaFunction) as MetaFunction;
        this.mappedOutputs.set(moduleRepo, schemaFunctionConfig.outputData);
        const schemaToLook = this.schemasManager.schemas.get(schema);
        if(!schemaToLook) throw new Error("Schema not found");
        return schemaToLook.bopsFunctions[operation];

      case "#":
        throw new Error("Not Yet Implemented");
        // TODO MAPIKIT provided

      case "%":
        await this.files.installer.install(moduleName, moduleVersion, ModuleKind.NPM);
        const functionJson = await this.files.externalFunctions.getFunctionDescriptionFile(moduleName);
        const externalFunctionConfig = JSON.parse(functionJson) as MetaFunction;
        this.mappedOutputs.set(moduleRepo, externalFunctionConfig.outputData);
        const mainFunction = await this.files.externalFunctions.importMain(
          moduleName,
          externalFunctionConfig.entrypoint,
          externalFunctionConfig.mainFunction,
        );
        return mainFunction;
    }
    throw new Error("One or more moduleRepos were invalid");
  }

  public async resolveModules (modules : BopsConfigurationEntry[]) : Promise<MappedFunction> {
    const mappedModules = new Map<string, Function>();
    for(const module of modules) {
      if(!mappedModules.get(module.moduleRepo)) {
        mappedModules.set(module.moduleRepo, await this.resolveModule(module.moduleRepo, module.version));
      }
    }
    return mappedModules;
  }
}




