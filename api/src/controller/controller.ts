import { Response, Router } from "express";
import { CrudService } from "../service";
import {
  FieldErrorDTO,
  Identifiable,
  Criteria as CriteriaType,
} from "../model";
import { Result } from "ts-results";

export interface CrudControllerValidator<Id, Criteria> {
  validateId(id: unknown): Result<Id, FieldErrorDTO[]>;
  validateCriteria(criteria: unknown): Result<Criteria, FieldErrorDTO[]>;
}

const handleError = (res: Response, error: unknown) => {
  res.status(500).json({ message: "Internal server error" });
  console.error(error);
};

export function createExpressCrudController<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria extends CriteriaType,
>(
  validator: CrudControllerValidator<Id, Criteria>,
  service: CrudService<Id, Entity, NewEntity, UpdateEntity, Criteria>,
): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const validation = validator.validateCriteria(req.query);

      if (validation.err) {
        res.status(400).json({
          message: "Invalid arguments",
          errors: validation.val,
        });
        return;
      }

      const search = await service.getBy(validation.val);
      res.status(200).json(search);
    } catch (e) {
      handleError(res, e);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const validation = validator.validateId(req.params.id);

      if (validation.err) {
        res.status(400).json(validation.val);
        return;
      }

      const search = await service.get(validation.val);

      if (search === undefined) {
        res.status(404).json({ message: "Record not found" });
        return;
      }

      res.status(200).json(search);
    } catch (e) {
      handleError(res, e);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const softValidation = validator.validateId(req.params.id);

      if (softValidation.err) {
        res.status(400).json(softValidation.val);
        return;
      }

      const validation = await service.delete(softValidation.val);

      if (validation.err) {
        res.status(400).json({ message: "Record not found" });
        return;
      }

      res.status(200).json(validation.val);
    } catch (e) {
      handleError(res, e);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const validation = await service.add(req.body);

      if (validation.err) {
        res.status(400).json({
          message: "Invalid arguments",
          errors: validation.val,
        });
        return;
      }

      res.status(201).json(validation.val);
    } catch (e) {
      handleError(res, e);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const validation = await service.update(req.body);

      if (validation.err) {
        res.status(400).json({
          message: "Invalid arguments",
          errors: validation.val,
        });
        return;
      }

      res.status(200).json(validation.val);
    } catch (e) {
      handleError(res, e);
    }
  });

  return router;
}
