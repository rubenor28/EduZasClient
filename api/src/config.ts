import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";


dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) ?? 10;

export const prisma = new PrismaClient();
await prisma.$connect();
