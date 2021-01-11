import faker from "faker";
import { HttpMethods } from "@api/common/meta-router";

export const httpMethodFactory = (predefined ?: HttpMethods) : HttpMethods => {
  return predefined ?? faker.helpers.randomize(["get", "post", "delete", "put", "patch"]);
};
