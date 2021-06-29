import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";

export class BopsManagerClass implements FunctionManager {
  private bopsMap = new Map<string, Function>();

  public get (funcitonName : string) : Function {
    return this.bopsMap.get(funcitonName);
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
