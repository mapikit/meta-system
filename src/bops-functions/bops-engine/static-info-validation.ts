import { ConstantTypeError } from "@api/bops-functions/bops-engine/engine-errors/constant-type-error";
import { InternalBopNotFound } from "@api/bops-functions/bops-engine/engine-errors/internal-bop-not-found";
import { JsonTypes } from "@api/common/types/json-types";
import {
  BopsConstant,
  BusinessOperations,
  JsonTypeDict } from "@api/configuration-de-serializer/domain/business-operations-type";
import { ConfigurationType } from "@api/configuration-de-serializer/domain/configuration-type";

export type ResolvedConstants = Record<string, unknown>;
/**
 * This class is responsible for gathering and validating all the static, immutable, info; such
 * as constants and internalBops
 */
export class StaticSystemInfo {
  private static validateConstant (constant : BopsConstant) : JsonTypeDict<JsonTypes> {
    if(typeof constant.value !== constant.type) throw new ConstantTypeError(constant);
    return constant.value;
  }

  private static validateConstants (constants : BopsConstant[]) : ResolvedConstants {
    const resolvedConstants = {};
    constants.forEach(constant => {
      resolvedConstants[constant.name] = this.validateConstant(constant);
    });
    return resolvedConstants;
  }

  private static findReferencedBops (allBops : BusinessOperations[]) : Record<string, BusinessOperations> {
    const foundBops = {};
    allBops.forEach(bop => {
      bop.configuration.forEach(config => {
        if(!foundBops[config.moduleRepo] && config.moduleRepo.includes("+")) {
          const referredBopName = config.moduleRepo.slice(1);
          const referredBop = allBops.find(bopRef => bopRef.name == referredBopName);
          if(!referredBop) throw new InternalBopNotFound(referredBopName);
          foundBops[config.moduleRepo] = referredBop;
        }
      });
    });
    return foundBops;
  }

  public static validateSystemStaticInfo (systemConfig : ConfigurationType)
    : Record<string, ResolvedConstants | BusinessOperations> {
    const bops = systemConfig.businessOperations;
    const allSystemConstants : Record<string, ResolvedConstants> = {};
    bops.forEach(bop => {
      allSystemConstants[bop.name] = this.validateConstants(bop.constants);
    });
    Object.assign(allSystemConstants, this.findReferencedBops(systemConfig.businessOperations));
    return Object.freeze(allSystemConstants);
  }
}
