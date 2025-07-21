import { Identifiable } from "./value_objects";

/**
 * Tipos posibles para los logs de la aplicación.
 *
 * - `SYSTEM_ERROR`: Errores internos del sistema (excepciones o fallas inesperadas).
 * - `VALIDATION_ERROR`: Cuando un dato enviado por el usuario no pasa la validación.
 * - `USER_ACTION`: Acciones del usuario (inicio de sesión, cierre de sesión, actualización de perfil).
 * - `ADMIN_ACTION`: Acciones administrativas (modificación de datos por un administrador).
 * - `DATA_MODIFICATION`: Creación, edición o eliminación de recursos importantes.
 * - `SECURITY_EVENT`: Eventos relacionados con la seguridad (intentos de acceso no autorizado, bloqueos, etc.).
 * - `EXTERNAL_SERVICE`: Problemas o respuestas de servicios externos (APIs, SMTP...).
 */
export enum LogType {
  SYSTEM_ERROR = "SYSTEM_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  USER_ACTION = "USER_ACTION",
  ADMIN_ACTION = "ADMIN_ACTION",
  DATA_MODIFICATION = "DATA_MODIFICATION",
  SECURITY_EVENT = "SECURITY_EVENT",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
}

/**
 * Representa una entrada de log en el sistema.
 *
 * Combina un identificador único con información del evento sucedido.
 */
export type Log = Identifiable<number> & {
  /** Fecha y hora en que ocurrió el evento. */
  timestamp: Date;

  /** Tipo del log, según la categoría definida en `LogType`. */
  type: LogType;

  /** Mensaje descriptivo del log. */
  message: string;

  /** (Opcional) Traza de pila, útil para errores del sistema. */
  stacktrace?: string;

  /** (Opcional) Información adicional relevante (ej. payload, contexto, headers). */
  metadata?: any;

  /** Identificador numérico del usuario asociado al evento. */
  userId: number;
};
