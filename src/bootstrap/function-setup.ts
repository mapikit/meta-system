import { MongoClient } from "mongodb";
import { BopsEngine } from "src/bops-functions/bops-engine/bops-engine";
import { ModuleManager } from "src/bops-functions/bops-engine/modules-manager";
import { StaticSystemInfo } from "src/bops-functions/bops-engine/static-info-validation";
import { BopsManagerClass } from "src/bops-functions/function-managers/bops-manager";
import { ExternalFunctionManagerClass } from "src/bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "src/bops-functions/function-managers/function-manager";
import { InternalFunctionManagerClass } from "src/bops-functions/function-managers/internal-function-manager";
import { BusinessOperation } from "src/configuration/business-operations/business-operation";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "src/configuration/business-operations/check-bops-functions-dependencies";
import { ConfigurationType } from "src/configuration/configuration-type";
import { SchemasType } from "src/configuration/schemas/schemas-type";
import { SchemasManager } from "src/schemas/application/schemas-manager";

export class FunctionSetup {
  private readonly bopsManager = new BopsManagerClass();
  private bopsEngine : BopsEngine;
  private bopsDependencyCheck = new Map<string, CheckBopsFunctionsDependencies>();

  public constructor (
    private internalFunctionManager : InternalFunctionManagerClass,
    private externalFunctionManager : ExternalFunctionManagerClass,
    private systemConfiguration : ConfigurationType,
  ) { }

  // eslint-disable-next-line max-lines-per-function
  public async setup () : Promise<void> {
    console.log(`[Function Setup] Starting bootstrap process for BOps functions in system "${
      this.systemConfiguration.name
    }"`);

    const allBopsDependencies : BopsDependencies[] = this.extractAllDependencies();
    this.checkInternalDependencies();
    this.checkSchemaDependencies();

    await this.bootstrapExternalDependencies(allBopsDependencies);
    this.checkExternalDependencies();

    const moduleManager = new ModuleManager({
      ExternalFunctionManager: this.externalFunctionManager,
      InternalFunctionManager: this.internalFunctionManager,
      BopsManager: this.bopsManager,
      SchemasManager: await this.createSchemasManager(this.systemConfiguration.schemas),
    });

    const mappedConstants = StaticSystemInfo.validateSystemStaticInfo(this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      MappedConstants: mappedConstants,
      ModuleManager: moduleManager,
      SystemConfig: this.systemConfiguration,
    });

    console.log("[Function Setup] Starting BOps build process");

    this.buildBops();
    console.log("[Function Setup] Success - Setup complete");
  }

  // eslint-disable-next-line max-lines-per-function
  private extractAllDependencies () : BopsDependencies[] {
    const result = [];

    const domainBops = this.systemConfiguration.businessOperations
      .map((bopsConfig) => new BusinessOperation(bopsConfig));

    this.systemConfiguration.businessOperations.forEach((bopsConfig) => {
      const dependencyCheck = new CheckBopsFunctionsDependencies(
        this.systemConfiguration.schemas,
        domainBops,
        new BusinessOperation(bopsConfig),
        this.externalFunctionManager,
        this.internalFunctionManager,
      );

      this.bopsDependencyCheck.set(bopsConfig.name, dependencyCheck);

      result.push(dependencyCheck.bopsDependencies);
    });

    return result;
  }

  private checkInternalDependencies () : void {
    console.log("[Function Setup] Checking BOps internal dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkInternalFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet internal dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkExternalDependencies () : void {
    console.log("[Function Setup] Checking BOps external dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkExternalRequiredFunctionsMet();

      if (!result) {
        throw Error(`Unmet External dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkSchemaDependencies () : void {
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkSchemaFunctionsDependenciesMet();
      const schemaDeps =  depCheck.bopsDependencies.fromSchemas.join(", ");
      const schemaDepsName = schemaDeps === "" ? "NO SCHEMA DEPENDENCIES" : schemaDeps;

      console.log(`[Function Setup] Checking schema function dependencies for BOp "${
        depCheck.bopsDependencies.bopName
      }": "${schemaDepsName}"`);

      if (!result) {
        throw Error(`Unmet Schema dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private async bootstrapExternalDependencies (allBopsDependencies : BopsDependencies[]) : Promise<void> {
    console.log("[Function Setup] Starting Bootstrap sequence for all system external dependencies");
    const externalDependenciesArray = allBopsDependencies
      .map((bopDependencies) => bopDependencies.external);

    const externalDependencies = externalDependenciesArray.reduce((previousValue, currentValue) => {
      const currentDependency = previousValue;
      currentValue.forEach((value) => currentDependency.push(value));

      return currentDependency;
    }, []);

    for (const dependency of externalDependencies) {
      const exists = this.externalFunctionManager.functionIsInstalled(dependency.name, dependency.version);

      if (!exists) {
        await this.externalFunctionManager.add(dependency.name.slice(1), dependency.version);
      }
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private async createSchemasManager (systemSchemas : SchemasType[]) : Promise<SchemasManager> {
    const dbConnection = new MongoClient(
      this.systemConfiguration.dbConnectionString,
      {
        useUnifiedTopology: true,
      },
    );

    const manager = new SchemasManager(
      this.systemConfiguration.name,
      dbConnection,
    );

    const schemasNames = systemSchemas.map((schemaType) => schemaType.name).join(", ");
    console.log(`[Schemas Setup] Adding shemas to the system: "${schemasNames}"`);

    await manager.addSystemSchemas(systemSchemas);

    return manager;
  }

  // eslint-disable-next-line max-lines-per-function
  private buildBops () : void {
    const unbuiltBopsNames = this.systemConfiguration.businessOperations.map((bopConfig) => {
      return bopConfig.name;
    }).filter((bopName) => !this.bopsManager.functionIsDeclared(bopName));

    if (unbuiltBopsNames.length === 0) {
      console.log("[BOps Build] All BOps are built");
      return;
    }

    console.log(`[BOps Build] Remaining BOps: [${unbuiltBopsNames.join(", ")}]`);

    const bopsWithMetDependencies = unbuiltBopsNames.filter((bopName) => {
      const bopsDependencies = this.bopsDependencyCheck.get(bopName).bopsDependencies;
      for (const bopDependencyFromBops of bopsDependencies.fromBops) {
        if (!this.bopsManager.functionIsDeclared(bopDependencyFromBops.slice(1))) {
          return false;
        }
      }

      return true;
    });

    bopsWithMetDependencies.forEach((bopName) => {
      const currentBopConfig = this.systemConfiguration.businessOperations
        .find((bopConfig) => bopConfig.name === bopName);
      console.log(`[BOps Build] Stitching "${bopName}"`);

      this.bopsManager.add(
        bopName,
        this.bopsEngine.stitch(currentBopConfig),
      );
    });

    this.buildBops();
  }

  public getBopsManager () : FunctionManager {
    return this.bopsManager;
  }
}
