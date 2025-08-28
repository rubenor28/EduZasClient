// user.update.type.zod.validator
import z from "zod";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";
import { newUserSchema } from "./new.user.type.zod.validator";

const schema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .extend(newUserSchema.shape);

export const userUpdateTypeZodValidator = createZodObjectTypeValidator(schema);
