import clone from "just-clone";

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

export class BrokerEntityFactory<T extends object> {
  private result : BrokerEntity;
  private readonly steps : Array<Function> = [];
  private readonly allowedActions : Map<string, EntityAction<T>> = new Map();
  private readonly permissions : string[] = [];
  private entityCopy : MetaEntity<T>;

  public withAction (action : EntityAction<T>) : this {
    const step = () : void => {
      if (!this.entityCopy) {
        throw Error("Must call '.usingEntity()' before this!");
      }

      if (this.permissions.includes(action.permission)) {
        this.result[action.name] = action.action(this.entityCopy.entity);
        this.allowedActions.set(action.name, action);
      }
    };

    this.steps.push(step);

    return this;
  }

  public withPermissions (perms : string[]) : this {
    this.steps.push(() => {
      this.permissions.push(...perms);
    });

    return this;
  }

  public usingEntity (entity : T, owner : string | symbol) : this {
    this.steps.push(() => {
      this.entityCopy = new MetaEntity(owner, clone(entity));
    });

    return this;
  }

  public build () : BrokerEntity {
    const intermediate = {
      done: () : void => {
        Object.keys(this.result).forEach((key) => {
          if (key === "done") return;
          if (this.allowedActions.get(key).callableInRuntime) return;

          this.result[key] = undefined;
        });
      },
    };

    this.result = intermediate;
    this.steps.forEach((step) => step());

    return this.result;
  }
  // Receber o singleton da entidade
  // copiar ele
  // Receber as permissões de entidade
  // cria um BrokerEntity somente com os métodos necessários
  // ligado na cópia de entidade
  // Injetar cópia das entidades nas ações instanciadas pelas permissões
  // Injetar o Event Bus
}

export class EntityAction<T extends object> {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly permission : string,
    public readonly name : string,
    public action : (ent : T) => Function,
    public readonly callableInRuntime : boolean = false,
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
export class MetaEntity<T extends object> {
  public readonly owner : symbol;
  public entity : T;

  public constructor (owner : symbol | string, entity: T) {
    this.owner = typeof owner === "string" ? Symbol(owner) : owner;
    this.entity = entity;
  }
}
