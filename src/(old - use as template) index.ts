import "module-alias/register";
import { container } from "./infrastructure/container";
import e = require("express");
import { APIRouter } from "./common/types/api-router";
import { TYPES } from "./infrastructure/types";
import { logger } from "./mapikit/logger/logger";

const rootRouter : APIRouter = container.resolve(TYPES.MapikitRouter);

const app = e();

app.use(e.json()); // for parsing application/json
app.use(e.urlencoded({ extended: true }));

const PORT = 8000;

app.use("/", rootRouter.router);

app.listen(PORT, () : void => {
  logger.info({ message : `we're listening on port ${PORT}` });
});

// TEPORARY TESTS

// import { TypeOrmSchemaRepository } from "@api/client/application/repositories/typeorm-schema-repository";
// import { Schema } from "./client/domain/models/schema";
// const repo = new TypeOrmSchemaRepository().initiate();

// const aa = async () : Promise<void> => {
//   const initiated = await repo;

//   console.log(await initiated.findByClient(
//     "e23b3ad3-810c-4446-908c-d0802631baca",
//   ));
// };

// aa();
