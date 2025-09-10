import { Class } from "./class";

/**
 * DTO expuesto en respuestas HTTP.
 *
 * Alias directo de {@link Class}, usado para distinguir entre:
 * - `Class`: tipo base en el dominio o capa interna.
 * - `PublicClass`: representación pública enviada al cliente.
 */
export type PublicClass = Class;
