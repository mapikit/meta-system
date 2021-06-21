export abstract class MetaProtocol<ProtocolConfig> {
  public constructor (
    protected protocolConfiguration : ProtocolConfig,
  ) {
    this.protocolConfiguration = Object.freeze(protocolConfiguration);
  }

  public abstract validateConfiguration () : void;
  public abstract start () : void;
}
