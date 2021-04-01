import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";

export const flatExampleSchema : SchemasType = {
  name: "exampleFlatSchema",
  format: {
    name: { type: "string" },
    age: { type: "number" },
    favoriteFood: { type: "string" },
    eyeColour: { type: "string" },
    height: { type: "number" },
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
