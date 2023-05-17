class Environment {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public variables : Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constants : Record<string, any> = new Proxy({}, {
    set: (object, property, value) : boolean => constantSetter(object, property, value, false),
    defineProperty: (object, property, value) : boolean => constantSetter(object, property, value, false),
    deleteProperty: (_object, property) : true => {
      console.log(`Cannot delete constant property ${String(property)}`);
      return true;
    },
  });

  /**
   * All subsequent constants and variable operations will be silent.
   * Even if an error is encountered no, log message will be displayed.
   */
  public silent : Omit<Environment, "silent"> = {
    variables: this.variables,
    constants: new Proxy({}, {
      set: (_object, property, value) : boolean => constantSetter(this.constants, property, value, true),
      defineProperty: (_object, property, value) : boolean => constantSetter(this.constants, property, value, true),
      deleteProperty: () : true => true,
    }),
  };
}

// eslint-disable-next-line max-params
function constantSetter (target : object, property : string | symbol, value : unknown, silent : boolean) : true {
  if(Object.keys(target).includes(String(property))) {
    if(silent) return true;

    console.error(
      `Environment constant "${String(property)}" already exists. Resetting its value is not allowed.\n` +
      "Use environment.variables if you need a variable environment value",
    );
  } else target[property] = value;
  return true;
}

export const environment = new Environment();
