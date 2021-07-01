export type HTTP_JSONBODY_CONFIGURATION = {
  port : number;
  routes : HTTPRouteConfiguration[];
};

export type HTTPRouteConfiguration = {
  route : string;
  businessOperation : string;
  method : "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  inputMapConfiguration : InputMap[];
  resultMapConfiguration : ResultMap;
}

export type InputMap = {
  origin : "route" | "queryParams" | "headers" | "body";
  originPath : string;
  targetPath : string;
}

export type ResultMap = {
  statusCode : string | number;
  headers : Array<Record<string, unknown>>;
  body : Record<string, unknown>;
}
