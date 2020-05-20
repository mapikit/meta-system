import { MapikitCommandContext } from "@api/mapikit/contexts/command-context";
import { TokenClient } from "@api/client/domain/authorized-client";
import { EventManager } from "birbs";
import { apiErrorHandler } from "@api/common/helpers/api-context-error-handler";

export interface SchemaState extends TokenClient {
  schemaId ?: string;
}

export class SchemaContext extends MapikitCommandContext<SchemaState> {

  public constructor (options : {
    SchemaManager : EventManager; })
  {
    super({ identifier: Symbol("SchemaContext") });
    this.errorHandler = apiErrorHandler.bind(this);
    this.manager = options.SchemaManager;
  }

  public isSameClientId (schemaClientId : string) : boolean {
    if(schemaClientId === this.contextState.clientId) {
      return true;
    }

    return false;
  }

};
