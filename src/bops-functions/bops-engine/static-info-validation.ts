
import { JsonTypes } from "src/common/types/json-types";
import { BopsConstant, JsonTypeDict } from "src/configuration/business-operations/business-operations-type";
import { ConfigurationType } from "src/configuration/configuration-type";
import { ConstantTypeError } from "./engine-errors/constant-type-error";

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


  public static validateSystemStaticInfo (systemConfig : ConfigurationType)
    : Record<string, ResolvedConstants> {
    const bops = systemConfig.businessOperations;
    const allSystemConstants : Record<string, ResolvedConstants> = {};
    bops.forEach(bop => {
      allSystemConstants[bop.name] = this.validateConstants(bop.constants);
    });
    return Object.freeze(allSystemConstants);
  }
}
