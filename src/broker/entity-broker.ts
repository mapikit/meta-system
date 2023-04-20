export class BrokerFactory {
  // recebe a lista de entidades e suas permissões
  // usa da BrokerEntityFactory para criar as entidades
  // Cria um entity broker somente com as entidades solicitadas
  // Por padrão expõe o logger, mas com um contexto de log
}

export interface EntityBroker {
  // mecanismo de DONE para encerrar as ações
  // 
}

export class BrokerEntityFactory {
  private readonly result = {};
  private readonly actions = [];

  public constructor () {
    
  }
  // Receber o singleton da entidade
  // copiar ele
  // Receber as permissões de entidade
  // cria um BrokerEntity somente com os métodos necessários
  // ligado na cópia de entidade
  // Injetar cópia das entidades nas ações instanciadas pelas permissões
  // Injetar o Event Bus
}

export class EntityAction<T = unknown> {
  public constructor (
    public readonly permission: string,
    public readonly callableInRuntime : boolean,
    public readonly name : string,
    public action : (ent : T) => Function,
  ) {}
}

export interface BrokerEntity {
  // Emite eventos avisando sobre alterações em entidades
  // Contém métodos de alteração em entidades
  // -> Create
  // -> Read
  // -> Update Mine
  // -> Update All
  // -> Delete mine
  // -> Delete Others
  
  // Deve ser instanciado por uma Factory
  done() : void;
}

/** handles ownership */
export class MetaEntity<T> {
  public readonly owner: Symbol
  public entity : T;

  public constructor (owner: Symbol | string, entity: T) {
    this.owner = typeof owner === "string" ? Symbol(owner) : owner;
    this.entity = entity;
  }
}
