import { PrismaClient } from "@prisma/client";

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) ?? 10;
export const prisma = new PrismaClient();
