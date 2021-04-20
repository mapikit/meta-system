import { ConstantTypeError } from "@api/bops-functions/bops-engine/engine-errors/constant-type-error";
import { JsonTypes } from "@api/common/types/json-types";
import { BopsConstant, JsonTypeDict } from "@api/configuration-de-serializer/domain/business-operations-type";
import { ConfigurationType } from "@api/configuration-de-serializer/domain/configuration-type";

export type ResolvedConstants = Record<string, JsonTypeDict>;

export class ConstantManagement {
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

  public static validateAllSystemConstants (systemConfig : ConfigurationType) : Record<string, ResolvedConstants> {
    const bops = systemConfig.businessOperations;
    const allSystemConstants : Record<string, ResolvedConstants>= {};
    bops.forEach(bop => {
      allSystemConstants[bop.name] = this.validateConstants(bop.constants);
    });
    return Object.freeze(allSystemConstants);
  }
}
