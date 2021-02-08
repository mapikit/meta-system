/* eslint-disable max-lines-per-function */
import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { RequestHandler } from "express";
import { QueryParser } from "./query-parser";

type HandlersList = { [handlerName : string] : (repo : MetaRepository, schema ?: SchemaObject) => RequestHandler };

export const handlers : HandlersList = {
  get: (repository : MetaRepository) => {
    return async (req, res) : Promise<void> => {
      await repository.findById(req.params.id)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    };
  },

  post: (repository : MetaRepository) => {
    return async (req, res) : Promise<void> => {
      await repository.insert(req.body)
        .then((result) => {
          res.statusCode = 200;
          res.send({
            message: "Inserted entity successfully",
            insertedId: result.insertedId,
          });
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    };
  },

  put: (repository : MetaRepository) => {
    return  async (req, res) : Promise<void> => {
      await repository.update(req.params.id, req.body)
        .then((result) => {
          res.statusCode = 200;
          res.send({
            message: "Entity Updated successfully",
            updatedId: result.upsertedId,
          });
        })
        .catch(error => {
          res.statusCode = 500;
          res.send({
            message: "There was an error while updating the entity",
            error,
          });
        });
    };
  },

  patch: (repository : MetaRepository) => {
    return  async (req, res) : Promise<void> => {
      await repository.update(req.params.id, req.body)
        .then((result) => {
          res.statusCode = 200;
          res.send({
            message: "Entity Updated successfully",
            updatedId: result.upsertedId,
          });
        })
        .catch(error => {
          res.statusCode = 500;
          res.send({
            message: "There was an error while updating the entity",
            error,
          });
        });
    };
  },

  delete: (repository : MetaRepository) => {
    return async (req, res) : Promise<void> => {
      await repository.deleteById(req.params.id)
        .then(() => {
          res.statusCode = 200;
          res.send({
            message : "Deleted entity successfully",
          });
        })
        .catch((error) => {
          res.statusCode = 500,
          res.send({
            message: "There was an error while deleting the entity",
            error,
          });
        });
    };
  },

  query: (repository : MetaRepository, schema : SchemaObject) => {
    return  async (req, res) : Promise<void> => {
      const resolvedQuery = QueryParser.parseQuery(req.query, schema);
      await repository.query(resolvedQuery)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    };
  },
};
