import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";

export class FunctionManagerDouble implements FunctionManager {
  public functionMap = new Map<string, Function>();

  public get (functionName : string) : Function {
    return this.functionMap.get(functionName);
  }
}