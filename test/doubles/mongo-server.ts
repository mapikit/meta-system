import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

export async function createFakeMongo () : Promise<MongoClient> {
  const mongoClientServer = new MongoMemoryServer();
  const uri = await mongoClientServer.getUri();

  return new MongoClient(uri,
    {
      useUnifiedTopology: true,
    });
};
