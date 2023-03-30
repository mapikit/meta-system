import { isBusinessOperations } from "../assertions/business-operations/is-business-operations.js";
import { BusinessOperation } from "./business-operation.js";
import { BopsCyclicDependencyCheck } from "./cyclic-dependency-check.js";
import { ValidateBopsCustomObjectsCommand } from "./validate-bops-custom-objects.js";
import { ValidateBopsPipelineFlowCommand } from "./validate-bops-pipeline-flow.js";

export class DeserializeBopsCommand {
  private result : BusinessOperation[] = [];

  public get bopsResults () : BusinessOperation[] {
    return this.result;
  }

  public execute (businessOperations : unknown[]) : void {
    businessOperations.forEach((businessOperationData) => {
      isBusinessOperations(businessOperationData);
      const businessOperationInstance = new BusinessOperation(businessOperationData);

      new ValidateBopsCustomObjectsCommand(businessOperationInstance).execute();
      new ValidateBopsPipelineFlowCommand().execute(businessOperationInstance);
      this.result.push(businessOperationInstance);
    });

    new BopsCyclicDependencyCheck(this.result).checkAllBops();
  }
}
