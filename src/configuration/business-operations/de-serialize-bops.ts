import { isBusinessOperations } from "../assertions/business-operations/is-business-operations";
import { PathUtils } from "../path-alias-utils";
import { BusinessOperation } from "./business-operation";
import { BopsCyclicDependencyCheck } from "./cyclic-dependency-check";
import { ValidateBopsCustomObjectsCommand } from "./validate-bops-custom-objects";
import { ValidateBopsPipelineFlowCommand } from "./validate-bops-pipeline-flow";

export class DeserializeBopsCommand {
  private result : BusinessOperation[] = [];

  public get bopsResults () : BusinessOperation[] {
    return this.result;
  }

  public execute (businessOperations : unknown[]) : void {
    const _businessOperations = PathUtils.getContent(businessOperations);
    _businessOperations.forEach((businessOperationData) => {
      isBusinessOperations(businessOperationData);
      const businessOperationInstance = new BusinessOperation(businessOperationData);

      new ValidateBopsCustomObjectsCommand(businessOperationInstance).execute();
      new ValidateBopsPipelineFlowCommand().execute(businessOperationInstance);
      this.result.push(businessOperationInstance);
    });

    new BopsCyclicDependencyCheck(this.result).checkAllBops();
  }
}
