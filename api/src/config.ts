import { PrismaClient } from "@prisma/client";

/**
 * Entorno de ejecución de la aplicación.
 *
 * Se obtiene de la variable de entorno `BUN_ENV`.
 * Útil para diferenciar configuraciones entre desarrollo, pruebas y producción.
 */
export const BUN_ENV = process.env.BUN_ENV;

/**
 * Puerto en el que el servidor escuchará las solicitudes HTTP.
 *
 * - Se obtiene de la variable de entorno `PORT`.
 * - Si no está definida, se usa por defecto el puerto `3000`.
 */
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * Número de registros por página en respuestas paginadas.
 *
 * - Se obtiene de la variable de entorno `PAGE_SIZE`.
 * - Si no está definida, se usa por defecto el valor `10`.
 */
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) ?? 10;

/**
 * Número de rondas o factor de costo para el algoritmo de hash de contraseñas.
 *
 * - Se obtiene de la variable de entorno `SALT_ROUNDS`.
 * - Si no está definida, se usa por defecto el valor `10`.
 */
export const SALT_OR_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 10;

/**
 * URL del frontend autorizado para interactuar con este backend.
 *
 * - Se obtiene de la variable de entorno `FRONTEND_URL`.
 * - Debe estar definida, de lo contrario se lanzará un error.
 */
export const FRONTEND_URL = process.env.FRONTEND_URL;

/**
 * Clave secreta utilizada para firmar y validar JWT.
 *
 * - Se obtiene de la variable de entorno `JWT_SECRET`.
 * - Debe estar definida, de lo contrario se lanzará un error en tiempo de ejecución.
 */
export const JWT_SECRET = `${process.env.JWT_SECRET}`;

/**
 * Instancia global del cliente de Prisma para acceder a la base de datos.
 *
 * Se recomienda mantener una única instancia para evitar problemas de conexión.
 */
export const prisma = new PrismaClient();

if (JWT_SECRET === undefined) {
  throw Error("JWT_SECRET must be defined");
}

if (FRONTEND_URL === undefined) {
  throw Error("FRONTEND_URL must be defined");
}

if (process.env.DATABASE_URL === undefined) {
  throw Error("DATABASE_URL must be defined");
}
