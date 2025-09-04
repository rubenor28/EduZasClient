import { createZodObjectTypeValidator } from "business/common/validators";
import z from "zod";

const schema = z.object({
  email: z.email("Se debe proporcionar un email"),
  password: z.string("Formato de contraseña inválido"),
});

export const userCredentialsZodValidator = createZodObjectTypeValidator(schema);
