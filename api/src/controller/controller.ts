import { Router } from "express";
import { CrudService } from "../service";
import { FieldErrorDTO, Identifiable } from "../model";
import { Result } from "ts-results";

export interface CrudControllerValidator<
  Id,
  NewEntity,
  UpdateEntity,
  Criteria,
> {
  validateNew(data: unknown): Result<NewEntity, FieldErrorDTO[]>;
  validate(data: unknown): Result<UpdateEntity, FieldErrorDTO[]>;
  validateId(id: unknown): Result<Id, FieldErrorDTO>;
  validateCriteria(criteria: unknown): Result<Criteria, FieldErrorDTO[]>;
}

export function createExpressCrudController<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
>(
  validator: CrudControllerValidator<Id, NewEntity, UpdateEntity, Criteria>,
  service: CrudService<Id, Entity, NewEntity, UpdateEntity, Criteria>,
): Router {
  const router = Router();

  router.get("/", (req, res) => {
    try {
      const validation = validator.validateCriteria(req.params);

      if (validation.err) {
        res
          .status(400)
          .json({ message: "Invalid arguments", errors: validation.val });

        return;
      } else {
        const search = service.getBy()
      }
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  });

  return router;
}
