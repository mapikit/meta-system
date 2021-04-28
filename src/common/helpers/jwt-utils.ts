import jwt from "jsonwebtoken";
import constants from "@api/common/constants";
import { TokenClient } from "@api/entity/domain/types/authorized-client";

interface TokenOutput extends TokenClient {
  iat ?: number;
  exp ?: number;
}
export function decodeToken (token : string) : TokenOutput {
  try {
    const result = jwt.verify(token, constants.JWT_KEY);
    assertDecoded(result);
    return result;
  } catch (err) {
    throw err;
  }
}

function assertDecoded (decoded : object | string) : asserts decoded is TokenOutput {
  if(Object.keys(decoded).includes("iat")) return;
  throw new Error("Invalid type for decoded token");
}
