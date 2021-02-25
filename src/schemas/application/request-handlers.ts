/* eslint-disable max-lines-per-function */
import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { RequestHandler } from "express";
import { parseQuery } from "@api/common/query-parser";

export class SchemaRequestHandlers {
  static get (repository : MetaRepository) : RequestHandler {
    return async (req, res) : Promise<void> => {
      await repository.findById(req.params.id)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send({
            message: "There was an error while finding the entities",
            error,
          });
        });
    };
  };

  static post (repository : MetaRepository) : RequestHandler {
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
  };

  static put (repository : MetaRepository) : RequestHandler {
    return  async (req, res) : Promise<void> => {
      await repository.updateById(req.params.id, req.body)
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
  };

  static patch (repository : MetaRepository) : RequestHandler {
    return  async (req, res) : Promise<void> => {
      await repository.updateById(req.params.id, req.body)
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
  };

  static delete (repository : MetaRepository) : RequestHandler {
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
  };

  static query (repository : MetaRepository, schema : SchemaObject) : RequestHandler {
    return  async (req, res) : Promise<void> => {
      const resolvedQuery = parseQuery(req.query, schema);
      await repository.query(resolvedQuery)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(res.send({
            message: "There was an error while finding the entities",
            error,
          }));
        });
    };
  };
};
