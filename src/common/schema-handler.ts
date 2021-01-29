import { SchemaObject, SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import constants from "@api/mapikit/constants";
import { RequestHandler } from "express";
import { FilterQuery, MongoClient } from "mongodb";
import MetaRouter, { HttpMethods } from "./meta-router";

type ExtendedHttpMethods = HttpMethods | "query";

export class SchemaHandler {
  private defaultConnection = new MongoClient(constants.MONGO.URL,
    {
      useUnifiedTopology: true,
      auth: {
        user: constants.MONGO.USER,
        password: constants.MONGO.PASS,
      },
    },
  );

  private schema : SchemasType;
  private repository : MetaRepository;
  private router : MetaRouter;

  constructor (schema : SchemasType) {
    this.schema = schema;
    this.repository = new MetaRepository(this.defaultConnection);
  }

  // eslint-disable-next-line max-lines-per-function
  public async initialize (systemName : string) : Promise<void> {
    console.log(`Creating meta repo for schema: ${this.schema.name}`);
    await this.repository.initialize(this.schema, systemName);

    console.log("Initializing route");
    this.router = new MetaRouter(`/${systemName}`);
    for(const method of this.getActiveMethods(this.schema.routes)) {
      this.router.createRoute(
        method === "query" ? "get" : method,
        `/${this.schema.name}`,
        this.handlers[method],
      );
    }
    //Test Code below
    console.log(this.router.activeRoutes);
    await this.router.listenOnPort(8000);
  }

  private handlers : { [handlerName : string] : RequestHandler } = {
    get: async (req, res) => {
      if(!req.body.id) return res.send({ message : "No id supplied" });
      await this.repository.findById(req.body.id)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    },

    post: async (req, res) => {
      await this.repository.findById(req.body.id)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    },

    put: async (req, res) => {
      if(!req.body) return res.send({ message: "No entity supplied" });
      await this.repository.insert(req.body)
        .then(() => {
          res.statusCode = 200;
          res.send({ message: "New entity inserted successfully" });
        })
        .catch(error => {
          res.send({
            message: "There was an error while inserting the entity",
            error,
          });
        });
    },

    patch: async (req, res) => {
      if(!req.body.id || !req.body) return res.send({ message: "Invalid entity in request" });
      await this.repository.update(req.body.id, req.body)
        .then(() => {
          res.statusCode = 200;
          res.send({ message : "Upadated entity successfully" });
        })
        .catch((error) => {
          res.statusCode = 500,
          res.send({
            message: "There was an error while updating the entity",
            error,
          });
        });
    },

    delete: async (req, res) => {
      if(!req.body.id) return res.send({ message: "Missing entity id" });
      await this.repository.delete(req.body.id)
        .then(() => {
          res.statusCode = 200;
          res.send({ message : "Deleted entity successfully" });
        })
        .catch((error) => {
          res.statusCode = 500,
          res.send({
            message: "There was an error while deleting the entity",
            error,
          });
        });
    },

    query: async (req, res) => {
      if(Object.keys(req.query).length === 0) return res.send({ message: "No query in request" });
      const resolvedQuery = this.parseQuery(req.query);
      await this.repository.query(resolvedQuery)
        .then(result => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch(error => {
          res.statusCode = 500;
          res.send(error);
        });
    },
  }

  private getActiveMethods (methods : SchemasType["routes"]) : Array<ExtendedHttpMethods> {
    const enabledMethods = new Array<ExtendedHttpMethods>(
      methods.deleteMethodEnabled ? "delete" : null,
      methods.patchMethodEnabled ? "patch" : null,
      methods.postMethodEnabled ? "post" : null,
      methods.putMethodEnabled ? "put" : null,
    ).filter(value => value !== null);

    if(methods.queryParamsGetEnabled) enabledMethods.push("query");
    else if (methods.getMethodEnabled) enabledMethods.push("get");

    return enabledMethods;
  }

  // eslint-disable-next-line max-lines-per-function
  private parseQuery<T> (
    query : FilterQuery<T>,
    schemaFormat : SchemaObject = this.schema.format,
  ) : FilterQuery<T> {
    const resolved : FilterQuery<object> = {};
    for(const propInSchema in schemaFormat) {
      if(query[propInSchema]) {
        if(schemaFormat[propInSchema].type == "object" && typeof query[propInSchema] == "object") {
          resolved[propInSchema] = this.parseQuery(query[propInSchema], schemaFormat[propInSchema]["data"]);
        }
        else if(schemaFormat[propInSchema].type == "array" && query[propInSchema] instanceof Array) {
          resolved[propInSchema] = [];
          for(const prop of query[propInSchema]) {
            resolved[propInSchema].push(this.resolveBasicType(
              prop,
              schemaFormat[propInSchema]["data"]));
          }
        }
        else {
          resolved[propInSchema] = this.resolveBasicType(query[propInSchema], schemaFormat[propInSchema].type);
        }
      }
    }
    return resolved;
  }

  private resolveBasicType (query : string, type : string) : string | number | boolean {
    if(type == "string") {
      return query;
    }
    else if(type == "number" && typeof Number(query == "number")) {
      return Number(query);
    }
    else if(type == "boolean" && ["true", "false"].includes(query)) {
      return Boolean(query);
    }
    return;
  }

}

