import { validateObject } from "@meta-system/object-definition";
import { logger } from "../../common/logger/logger.js";
import { MetaFileType } from "../../common/meta-file-type.js";

const metaFileTypeDef = {
  name: { type: "string", required: true },
  version: { type: "string", required: false },
  entrypoint: { type: "string", required: true },
};

export function validateMetaFile (file : unknown, identifier : string) : asserts file is MetaFileType {
  logger.info(`Validating meta-file for "${identifier}"`);
  const validationResult = validateObject(file, metaFileTypeDef);
  if(validationResult.errors.length > 0) {
    throw Error(`"${identifier}" Does not have a valid Meta-File:\n` +
      validationResult.errors.map(error => `${error.path} :: ${error.error}`).join("\n"),
    );
  }
}
