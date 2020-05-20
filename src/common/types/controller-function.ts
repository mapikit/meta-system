import { MapikitRequest } from "./mapikit-request";

export type ControllerFunction = (request : MapikitRequest, response : any) => Promise<void>;
