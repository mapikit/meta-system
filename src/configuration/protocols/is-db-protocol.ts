import { DBProtocol } from "@meta-system/meta-protocol-helper";

export function assertsDbProtocol (instance : unknown) : asserts instance is DBProtocol<unknown> {
  if (typeof instance !== "object") {
    throw Error("Db Protocol should be an object");
  }

  if (typeof instance["initialize"] !== "function") {
    throw Error("Evaluated DB protocol does not contain an initialize function");
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
