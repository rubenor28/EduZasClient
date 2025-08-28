import { Router } from "express";

import { bcryptHasher } from "business/common/services/hasher";
import { addUserUseCase } from "business/users/useCases";
import { userPrismaRepository } from "persistence/users/repositories/user.prisma.repository";
import { newUserTypeZodValidator } from "business/users/validators/zod";
import { newUserBusinessZodValidator } from "business/users/validators/zod/new.user.business.zod.validator";

const repository = userPrismaRepository;

const hasher = bcryptHasher;
const newUserTypeValidator = newUserTypeZodValidator;
const newUserBusinessValidator = newUserBusinessZodValidator;

export const userController = Router();

userController.post("/", async (req, res) => {
  try {
    const validation = newUserTypeValidator.validate(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Error al registrar, entrada inválida",
        error: validation.error,
      });
    }

    const result = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: validation.value,
    });

    if (!result.ok) {
      return res.status(400).json({
        message: "Error al registrar, entrada inválida",
        error: result.val,
      });
    }

    return res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
