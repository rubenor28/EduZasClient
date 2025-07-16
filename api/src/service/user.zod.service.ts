import {
  simpleNameRegex,
  tuitionRegex,
  compositeNameRegex,
  type FieldErrorDTO,
  type NewUserDTO,
  type User,
  type UserCriteriaDTO,
} from "../model";
import z from "zod";
import { Result, Ok, Err } from "ts-results";

const baseValidation = z.object({
  tuition: z.coerce
    .string("La matrícula debe ser una cadena")
    .toUpperCase()
    .regex(tuitionRegex, "Formato de matrícula inválido"),
  firstName: z.coerce
    .string("El primer nombre debe ser una cadena")
    .toUpperCase()
    .regex(simpleNameRegex, "Formato de nombre inválido"),
  midName: z.coerce
    .string("El el segundo nombre debe ser una cadena")
    .toUpperCase()
    .refine(
      (val) => simpleNameRegex.test(val) || compositeNameRegex.test(val),
      { error: "Formato de nombre inválido" },
    )
    .optional(),
  fatherLastname: z.coerce
    .string("El segundo apellido debe ser una cadena")
    .toUpperCase()
    .regex(simpleNameRegex, "Formato de apellido inválido"),
  motherLastname: z.coerce
    .string("El apellido materno debe ser una cadena")
    .toUpperCase()
    .refine(
      (val) => simpleNameRegex.test(val) || compositeNameRegex.test(val),
      { error: "Formato de apellido inválido" },
    )
    .optional(),
});
