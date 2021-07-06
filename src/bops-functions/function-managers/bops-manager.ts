import { FunctionManager } from "./function-manager";

export class BopsManagerClass implements FunctionManager {
  private bopsMap = new Map<string, Function>();

  public get (functionName : string) : Function {
    if (functionName.charAt(0) === "+") {
      return this.bopsMap.get(functionName.slice(1));
    }

    return this.bopsMap.get(functionName);
  }

  public add (functionName : string, declaration : Function) : void {
    this.bopsMap.set(functionName, declaration);
  }

  public functionIsDeclared (functionName : string) : boolean {
    return this.bopsMap.has(functionName);
  }
}

const bopsManager = new BopsManagerClass();

export default bopsManager;
