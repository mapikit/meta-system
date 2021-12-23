import { DBProtocol } from "@meta-system/meta-protocol-helper";

export function assertsDbProtocol (instance : unknown, message ?: string) : asserts instance is DBProtocol<unknown> {
  if (typeof instance !== "object") {
    console.log(instance);
    throw Error("Db Protocol should be an object " + message ?? "");
  }

  if (typeof instance["initialize"] !== "function") {
    throw Error("Evaluated DB protocol does not contain an initialize function, therefore it is not valid"
      + message ?? "");
  }
}

export function isDbProtocol (instance : unknown) : boolean {
  let result = true;

  try {
    assertsDbProtocol(instance);
  } catch {
    result = false;
  }

  return result;
}
