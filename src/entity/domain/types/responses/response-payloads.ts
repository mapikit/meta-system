import { MapikitResponsePayload } from "@api/common/response/response-payload";


export interface InsertEntityResponse extends MapikitResponsePayload {
  data : { message : "Inserted"};
  statusCode : 201;
}

export interface SetupContextResponse extends MapikitResponsePayload {
  data : { message : "Context Setup"};
  statusCode : 201;
}
