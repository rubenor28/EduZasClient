import { Router } from "express";
import { CrudService } from "../service";
import { Identifiable } from "../model";

export interface ControllerValidator {

}

export function createExpressCrudController<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
>(service: CrudService<Id, Entity, NewEntity, UpdateEntity, Criteria>): Router {
  const router = Router();

  router.get("/", (req, res) => {

  });

  return router;
}
