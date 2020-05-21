import { MapikitResponsePayload } from "@api/common/response/response-payload";


export interface InsertEntityResponse extends MapikitResponsePayload {
  data : { message : "Inserted"};
  statusCode : 201;
}
