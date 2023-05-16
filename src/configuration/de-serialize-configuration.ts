import clone from "just-clone";
import { validateObject } from "@meta-system/object-definition";
import { Configuration } from "./configuration.js";
import { PathUtils } from "./path-alias-utils.js";
import { configurationTypeDefinition } from "./configuration-definition.js";
import { ValidationOutput } from "@meta-system/object-definition/dist/functions/validate-object.js";
import { logger } from "../common/logger/logger.js";
import { EntityValue } from "../entities/meta-entity.js";

const referenceableProperties : Array<keyof Configuration> = [
  "schemas",
  "businessOperations",
];

export class DeserializeConfigurationCommand {
  private _result : Configuration;
  public validation : ValidationOutput;

  public get result () : Configuration {
    return this._result;
  };

  // eslint-disable-next-line max-lines-per-function
  public async execute (input : unknown) : Promise<void> {
    this._result = clone(input as object) as Configuration;
    await this.replaceReferences(this._result);
    this.validation = validateObject(this._result, configurationTypeDefinition);

    this.logErrorsAndAbort(this.validation);
    this.checkUniqueIdentifiers(this._result.schemas);
    this.checkUniqueIdentifiers(this._result.businessOperations);
    this.checkUniqueIdentifiers(this._result.addons);

    this.validateBusinessOperations();
    this.checkAddonsSourceUniqueness();
    this._result = new Configuration(this._result);
  }

  private async replaceReferences (input : unknown) : Promise<void> {
    for(const property of referenceableProperties) {
      input[property] = await PathUtils.getContents(input[property]);
    }
  }

  private logErrorsAndAbort (validation : ValidationOutput) : void {
    validation.errors.forEach(err => {
      logger.error(`[CONFIG VALIDATION] Error at configuration path: "${err.path}" -- `, err.error);
    });

    if (validation.errors.length > 0) {
      throw Error("Config validation failed!");
    }
  }

  private checkUniqueIdentifiers (entities : EntityValue[]) : void {
    const identifiers = new Set();

    entities.forEach((ent) => {
      if (identifiers.has(ent.identifier)) {
        logger.error(`[CONFIG VALIDATION] Found entities with duplicate identifiers! "${ent.identifier}"`
          + " - All Identifiers should be unique!",
        );
        return;
      }

      identifiers.add(ent.identifier);
    });
  }

  private validateBusinessOperations () : void {
    const bops = this._result.businessOperations;

    // Check bops Keys are not duplicates
    bops.forEach((bop) => {
      const keys = new Set();

      bop.configuration.forEach((moduleData) => {
        if (keys.has(moduleData.key)) {
          // eslint-disable-next-line max-len
          logger.error(`[CONFIG VALIDATION] Found Module within BOp "${bop.identifier}" with duplicate keys! "${moduleData.key}"`
            + " - All keys within a BOp should be unique!",
          );
          return;
        }

        keys.add(moduleData.key);
      });
    });
  }

  private checkAddonsSourceUniqueness () : void {
    const addons = this._result.addons;

    const sources = new Set();
    addons.forEach((addon) => {
      if (sources.has(addon.source)) {
        logger.error(`[CONFIG VALIDATION] Found Addon "${addon.identifier}" with duplicate sources! "${addon.source}"`
          + " - All sources should be unique!",
        );
        return;
      }

      sources.add(addon.source);
    });
  }
}
