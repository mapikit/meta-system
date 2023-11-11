import { NodeCollectStrategies } from "./node-strategies.js";
import { BrowserCollectStrategies } from "./browser-strategies.js";

export class Strategies {
  public static node = NodeCollectStrategies;
  public static browser = BrowserCollectStrategies;
}
