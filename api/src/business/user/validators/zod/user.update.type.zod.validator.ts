import z from "zod";
import { Gender, UserType } from "../../../persistence/users/enums";
import { createZodObjectTypeValidator } from "../../common/validators/zod/zod.validator";
import { newUserSchema } from "./new.user.type.zod.validator";

const schema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .extend(newUserSchema);

export const userUpdateTypeZodValidator = createZodObjectTypeValidator(schema);
