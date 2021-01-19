// eslint-disable-next-line max-len
import { isBusinessOperations } from "@api/configuration-de-serializer/domain/assertions/business-operations/is-business-operations";

export class BusinessOperationsDesserializer {
  public execute (businessOperations : unknown) : void {
    isBusinessOperations(businessOperations);
  }
}
