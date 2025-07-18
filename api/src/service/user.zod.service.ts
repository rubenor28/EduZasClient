import {
  simpleNameRegex,
  tuitionRegex,
  compositeNameRegex,
  passwordRegex,
  type NewUserDTO,
  type User,
  type UserCriteriaDTO,
  type UpdateUserDTO,
  StringSearchType,
} from "../model";
import z from "zod";
import { Ok, Err } from "ts-results";
import type { CrudValidator } from "./service";
import type { Repository } from "../repository";
import { zodToFieldErrors } from "../parsers/zod.parser";

/**
 * Fabrica un validador Zod para la entidad `User`, aplicando reglas estándar
 * y validaciones adicionales (unicidad de matrícula y correo).
 *
 * @template Id - Tipo del identificador único de usuario (normalmente `number`).
 * @template UserDTONuevo - Tipo de datos requeridos para crear un usuario.
 * @template UserDTOUpdate - Tipo de datos permitidos para actualizar un usuario.
 * @template UserCriteria - Tipo usado para filtrar usuarios en las consultas de unicidad.
 *
 * @param repo - Repositorio que permite validar la unicidad de `tuition` y `email`.
 * @returns Un objeto que implementa `CrudValidator` con métodos `validateNew` y `validate`.
 */
export function makeUserZodValidator(
  repo: Repository<number, User, NewUserDTO, UpdateUserDTO, UserCriteriaDTO>,
): CrudValidator<number, User, NewUserDTO, UpdateUserDTO, UserCriteriaDTO> {
  const base = z.object({
    tuition: z.string().toUpperCase().trim().regex(tuitionRegex),
    firstName: z.string().toUpperCase().trim().regex(simpleNameRegex),
    midName: z
      .string()
      .toUpperCase()
      .trim()
      .refine(
        (val) => simpleNameRegex.test(val) || compositeNameRegex.test(val),
        {
          message: "Formato de segundo nombre inválido",
        },
      )
      .optional(),
    fatherLastname: z.string().toUpperCase().trim().regex(simpleNameRegex),
    motherLastname: z
      .string()
      .toUpperCase()
      .trim()
      .refine(
        (val) => simpleNameRegex.test(val) || compositeNameRegex.test(val),
        {
          message: "Formato de apellido materno inválido",
        },
      )
      .optional(),
    gender: z.string().trim().optional(),
    email: z.email().trim(),
    password: z.string().trim().regex(passwordRegex),
  });

  const createSchema = base
    .check(async (ctx) => {
      const user = ctx.value;

      const emailCriteria: UserCriteriaDTO = {
        email: { string: user.email, searchType: StringSearchType.EQ },
      };

      const emailRes = await repo.getBy(emailCriteria, 1);

      if (emailRes.results.length > 0) {
        ctx.issues.push({
          code: "custom",
          message: "Ya existe un usuario con este correo",
          path: ["email"],
          input: user.email,
        });
      }
    })
    .check(async (ctx) => {
      const user = ctx.value;

      const tuitionCriteria: UserCriteriaDTO = {
        tuition: { string: user.tuition, searchType: StringSearchType.EQ },
      };

      const tuitionRes = await repo.getBy(tuitionCriteria, 1);

      if (tuitionRes.results.length > 0) {
        ctx.issues.push({
          code: "custom",
          message: "Ya existe un usuario con esta matrícula",
          path: ["tuition"],
          input: user.tuition,
        });
      }
    });

  const updateSchema = base
    .extend({
      id: z.coerce
        .number("El id debe ser un número")
        .int("El id debe ser un entero")
        .refine(async (id) => (await repo.get(id)) !== undefined, {
          message: "Id no encontrado",
          path: ["id"],
        }),
    })
    .check(async (ctx) => {
      const user = ctx.value;

      const emailCriteria: UserCriteriaDTO = {
        email: { string: user.email, searchType: StringSearchType.EQ },
      };

      const emailRes = await repo.getBy(emailCriteria, 1);

      if (emailRes.results.length > 0 && emailRes.results[0]?.id !== user.id) {
        ctx.issues.push({
          code: "custom",
          message: "Ya existe un usuario con este correo",
          path: ["email"],
          input: user.email,
          continue: true,
        });
      }
    })
    .check(async (ctx) => {
      const user = ctx.value;

      const tuitionCriteria: UserCriteriaDTO = {
        tuition: { string: user.tuition, searchType: StringSearchType.EQ },
      };

      const tuitionRes = await repo.getBy(tuitionCriteria, 1);

      if (
        tuitionRes.results.length > 0 &&
        tuitionRes.results[0]?.id !== user.id
      ) {
        ctx.issues.push({
          code: "custom",
          message: "Ya existe un usuario con esta matrícula",
          path: ["tuition"],
          input: user.tuition,
          continue: true,
        });
      }
    });

  return {
    //TODO: Reparar validación de matricula repetida
    
    /**
     * Valida los datos para crear un nuevo usuario.
     *
     * @param data - Datos conforme a `NewUserDTO`.
     * @returns `Ok(undefined)` si es válido, o `Err(...)` con errores por campo.
     */
    async validateNew(data) {
      const validation = await createSchema.safeParseAsync(data);
      return validation.success
        ? Ok(undefined)
        : Err(zodToFieldErrors(validation.error));
    },

    /**
     * Valida los datos para actualizar un usuario existente.
     *
     * @param data - Datos conforme a `UpdateUserDTO` (incluye `id`).
     * @returns `Ok(undefined)` si es válido, o `Err(...)` con errores por campo.
     */
    async validate(data) {
      const result = await updateSchema.safeParseAsync(data);
      return result.success
        ? Ok(undefined)
        : Err(zodToFieldErrors(result.error));
    },
  };
}
