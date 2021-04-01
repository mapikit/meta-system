import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";

export const deepExampleSchema : SchemasType = {
  name: "exampleDeepSchema",
  format: {
    name: { type: "string" },
    job: {
      type: "object",
      data: {
        wage: { type: "number" },
        name: { type: "string" },
        hiredAt: { type: "date" },
      },
    },
  },
  routes: {
    getMethodEnabled: false,
    postMethodEnabled: false,
    deleteMethodEnabled: false,
    patchMethodEnabled: false,
    putMethodEnabled: false,
    queryParamsGetEnabled: false,
  },
};
