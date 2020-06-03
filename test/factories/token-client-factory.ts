import faker from "faker";
import { TokenClient } from "@api/entity/domain/types/authorized-client";

export const tokenClientFactory = (predefined : Partial<TokenClient>) : TokenClient => {
  const creationInput : TokenClient = {
    clientId: predefined.clientId || faker.random.uuid(),
    clientName: predefined.clientName || faker.name.firstName(),
    clientEmail: predefined.clientEmail || faker.internet.email(),
    clientUsername: predefined.clientUsername || faker.internet.userName(),
  };

  return creationInput;
};
