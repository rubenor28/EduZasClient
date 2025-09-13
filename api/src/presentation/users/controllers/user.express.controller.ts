import { Router } from "express";
import type { Hasher } from "business/auth/services";
import type { UserRepository } from "persistence/users/repositories";
import { addUserUseCase } from "business/users/useCases";
import { userToPublicUser } from "persistence/users/mappers";
import {
  BusinessValidator,
  ObjectTypeValidator,
} from "business/common/validators";
import { NewUser, User } from "persistence/users/entities";

/**
 * Crea un controlador de Express para gestionar operaciones relacionadas con usuarios.
 *
 * Este controlador implementa el endpoint **POST `/`** para crear un nuevo usuario.
 * Valida los datos de entrada en dos etapas:
 * 1. **Validación de tipos** (estructura y tipos de datos) mediante
 *    `newUserTypeValidator`.
 * 2. **Validación de negocio** (reglas adicionales como unicidad, formato, etc.)
 *    mediante `newUserBusinessValidator`.
 *
 * Si la validación es exitosa, delega la lógica de creación en el caso de uso
 * {@link addUserUseCase}, y devuelve el usuario creado en su forma pública
 * usando {@link userToPublicUser}.
 *
 * @param opts Dependencias necesarias para el controlador:
 * - `repository`: Repositorio de usuarios (persistencia).
 * - `hasher`: Servicio para encriptar contraseñas.
 * - `newUserTypeValidator`: Validador de tipos para la entrada.
 * - `newUserBusinessValidator`: Validador de reglas de negocio para la entrada.
 *
 * @returns Un `Router` de Express con las rutas configuradas.
 *
 * @example
 * ```ts
 * import express from "express";
 *
 * const app = express();
 * app.use(express.json());
 * app.use("/users", userExpressController);
 * ```
 */
export function createUserExpressController(opts: {
  repository: UserRepository;
  hasher: Hasher;
  newUserTypeValidator: ObjectTypeValidator<NewUser>;
  newUserBusinessValidator: BusinessValidator<User>;
}) {
  const { repository, hasher, newUserTypeValidator, newUserBusinessValidator } =
    opts;
  const router = Router();

  /**
   * POST `/`
   *
   * Crea un nuevo usuario en el sistema.
   * - Valida la entrada contra el esquema de tipos y reglas de negocio.
   * - Si falla, responde con `400 Bad Request`.
   * - Si la creación es exitosa, responde con `201 Created` y el usuario en
   *   formato público (sin información sensible como contraseñas).
   */
  router.post("/", async (req, res) => {
    try {
      // Validación de tipos
      const validation = newUserTypeValidator.validate(req.body);

      if (!validation.success) {
        return res
          .status(400)
          .json({ message: "Error", error: validation.error });
      }

      // Ejecución del caso de uso
      const result = await addUserUseCase.execute({
        repository,
        hasher,
        validator: newUserBusinessValidator,
        input: validation.value,
      });

      if (!result.ok) {
        return res.status(400).json({ message: "Error", error: result.val });
      }

      // Éxito: devuelve el usuario público
      return res
        .status(201)
        .json({ message: "Created", record: userToPublicUser(result.val) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}

import { userPrismaRepository } from "persistence/users/repositories";
import { bcryptHasher } from "business/auth/services";
import { newUserTypeZodValidator } from "business/users/validators/zod";
import { newUserBusinessZodValidator } from "business/users/validators/zod";

/**
 * Instancia lista para usar del controlador de usuarios en Express.
 *
 * Configura el controlador con implementaciones reales de:
 * - `userPrismaRepository` como repositorio de persistencia.
 * - `bcryptHasher` como servicio de hash de contraseñas.
 * - `newUserTypeZodValidator` para validación de tipos con Zod.
 * - `newUserBusinessZodValidator` para validación de reglas de negocio.
 */
export const userExpressController = createUserExpressController({
  repository: userPrismaRepository,
  hasher: bcryptHasher,
  newUserTypeValidator: newUserTypeZodValidator,
  newUserBusinessValidator: newUserBusinessZodValidator,
});
