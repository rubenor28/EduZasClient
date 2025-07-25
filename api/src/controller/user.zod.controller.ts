import { Gender } from "@prisma/client";
import { NewUserDTO, UpdateUserDTO, UserCriteriaDTO } from "../model";
import { CrudControllerValidator } from "./controller";
import z from "zod";
import { zodToFieldErrors } from "../parsers/zod.parser";
import { Err, Ok } from "ts-results";

type UserZodCtrlValidator = CrudControllerValidator<number, UserCriteriaDTO>;

const idSchema = z.object({
  id: z.number("El id debe ser un número").int("El id debe ser un entero"),
});

const criteriaSchema = z.object({});

const userZodCtrlValidator: UserZodCtrlValidator = {
  validateId(id) {
    const validation = idSchema.safeParse(id);

    if (!validation.success) {
      return Err(zodToFieldErrors(validation.error));
    }

    return Ok(validation.data.id);
  },

  validateCriteria(criteria) {},
};
