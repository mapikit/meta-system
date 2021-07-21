import { FunctionManager } from "../../bops-functions/function-managers/function-manager";

export abstract class MetaProtocol<ProtocolConfig> {
  public constructor (
    protected protocolConfiguration : ProtocolConfig,
    protected functionManager : FunctionManager,
  ) {
    this.protocolConfiguration = Object.freeze(protocolConfiguration);
  }

  public abstract validateConfiguration () : void;
  public abstract start () : Promise<void>;
  public abstract stop () : Promise<void>;
}
