export enum ResponseMessages {
  internalServerError = "Internal Server Error",
  invalidRequest = "Request format was invalid",

  //Auth Messages
  tokenInvalid = "The given authorization token is invalid",
  tokenExpired = "The token has already expired",

  //Entity
  invalidClientId = "Schema client does not match authorized client",
  schemaTypeMismatch = "An entity field type does not match one of the schemaFields type",
  contextNotSetup = "The clients context has not yet been setup",
  invalidSchema = "The schema requested does not exist"

};