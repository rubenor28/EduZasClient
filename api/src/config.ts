import { PrismaClient } from "@prisma/client";

export const BUN_ENV = process.env.BUN_ENV;
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) ?? 10;
export const SALT_OR_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 10;

export const prisma = new PrismaClient();
