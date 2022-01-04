import { MongoMemoryServer } from "mongodb-memory-server";

export async function createFakeMongo () : Promise<string> {
  const mongoClientServer = await MongoMemoryServer.create();
  const uri = mongoClientServer.getUri();

  return uri;
};
