import { MapikitRequest } from "@api/common/types/mapikit-request";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { Context } from "birbs";
import { Birbable } from "birbs/lib/src/types";

export interface ManagerRoutineInfo {
  request : MapikitRequest;
  response : MapikitResponse;
  birbable : Birbable;
  context : Context;
}
