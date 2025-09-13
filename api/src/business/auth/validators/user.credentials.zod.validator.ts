import z from "zod";
import { createZodObjectTypeValidator } from "business/common/validators";

/**
 * Define el esquema de validación de Zod para las credenciales de un usuario.
 *
 * Requiere un `email` válido y una `password` de tipo string.
 * @internal
 */
const schema = z.object({
  email: z.email("Se debe proporcionar un email válido"),
  password: z.string().min(1, "Se debe proporcionar una contraseña"),
});

/**
 * Validador de objetos para las credenciales de un usuario (email y contraseña).
 *
 * Este objeto, creado con la biblioteca **Zod**, se utiliza para asegurar que
 * los datos de inicio de sesión o registro cumplen con el formato esperado.
 * Es una implementación concreta de `ObjectTypeValidator`.
 *
 * @example
 * ```typescript
 * const credentials = { email: 'test@example.com', password: 'password123' };
 * const result = userCredentialsZodValidator.validate(credentials);
 * // result.success -> true
 *
 * const badCredentials = { email: 'not-an-email', password: '' };
 * const result2 = userCredentialsZodValidator.validate(badCredentials);
 * // result2.success -> false
 * ```
 */
export const userCredentialsZodValidator = createZodObjectTypeValidator(schema);
