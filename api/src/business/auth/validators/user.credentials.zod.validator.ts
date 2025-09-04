import { createZodObjectTypeValidator } from "business/common/validators";
import { passwordRegex } from "business/users/validators/regexs";
import z from "zod";

const schema = z.object({
  email: z.email("Email no encontrado"),
  password: z
    .string("Contraseña incorrecta")
    .regex(passwordRegex, "Contraseña incorrecta"),
});

export const userCredentialsZodValidator = createZodObjectTypeValidator(schema);
