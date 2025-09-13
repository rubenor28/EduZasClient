import z from "zod";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  tuition: z.string(),
  firstName: z.string(),
  midName: z.string().optional(),
  fatherLastname: z.string(),
  motherLastname: z.string().optional(),
  email: z.string(),
});

export const publicUserTypeZodValidator = createZodObjectTypeValidator(schema);
