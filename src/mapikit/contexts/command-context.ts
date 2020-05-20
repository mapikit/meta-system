import { Context, EventManager } from "birbs";
import { MapikitErrorPayload } from "@api/common/response/error-payload";
import { MapikitResponsePayload } from "@api/common/response/response-payload";

export class MapikitCommandContext<T = undefined> extends Context<T> {
  public responseIdentifier : symbol | string;
  public manager : EventManager;

  public setResponse <T extends MapikitResponsePayload> (data : T) : void {
    this.manager.broadcast({ birbable: "SetResponse", context: this.responseIdentifier }, data);

    this.terminateContext();
  }

  public setError (error : MapikitErrorPayload) : void {
    this.manager.broadcast({ birbable: "SetError", context: this.responseIdentifier }, error);

    this.terminateContext();
  }

  public terminateContext () : void {
    this.manager.removeContext(this.identifier).removeContext(this.responseIdentifier);
  }
}
