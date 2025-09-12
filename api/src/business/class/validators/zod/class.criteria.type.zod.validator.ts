import z from "zod";
import {
  uIntZodSchema,
  stringQueryZodSchema,
  createZodObjectTypeValidator,
} from "business/common/validators";

const schema = z.object({
  id: stringQueryZodSchema.optional(),
  page: uIntZodSchema.optional().default(1),
  ownerId: uIntZodSchema.optional(),
  subject: stringQueryZodSchema.optional(),
  section: stringQueryZodSchema.optional(),
  className: stringQueryZodSchema.optional(),
});

export const classCriteriaTypeValidator = createZodObjectTypeValidator(schema);
