import { isBusinessOperations } from "../assertions/business-operations/is-business-operations";
import { BusinessOperation } from "./business-operation.js";
import { BopsCyclicDependencyCheck } from "./cyclic-dependency-check";
import { ValidateBopsCustomObjectsCommand } from "./validate-bops-custom-objects";
import { ValidateBopsPipelineFlowCommand } from "./validate-bops-pipeline-flow";

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
