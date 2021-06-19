// eslint-disable-next-line max-len
import { isBusinessOperations } from "@api/configuration/domain/assertions/business-operations/is-business-operations";
import { BusinessOperation } from "@api/configuration/domain/business-operation";
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
  }
}
