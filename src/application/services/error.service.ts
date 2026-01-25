import { AppError, InternalServerError } from "@application";

type Subscriber = (error: AppError | null) => void;

/**
 * Un servicio singleton para gestionar y notificar errores globales en la aplicación.
 * Permite que los manejadores de errores globales (fuera de React) se comuniquen
 * con los componentes de React de una manera desacoplada.
 */
class ErrorService {
  private subscribers: Subscriber[] = [];
  private error: AppError | null = null;

  /**
   * Se suscribe a los cambios de error.
   * @param callback La función a llamar cuando ocurre un error.
   * @returns Una función para cancelar la suscripción.
   */
  public subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    // Llama inmediatamente al callback con el error actual, si lo hay.
    callback(this.error);

    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  /**
   * Notifica a todos los suscriptores sobre un nuevo error.
   * @param error El error que ha ocurrido.
   */
  public notify(error: unknown): void {
    this.error = error instanceof AppError ? error : new InternalServerError();
    this.subscribers.forEach((callback) => callback(this.error));
  }

  /**
   * Limpia el error actual y notifica a los suscriptores.
   */
  public clear(): void {
    this.error = null;
    this.subscribers.forEach((callback) => callback(this.error));
  }
}

// Exportamos una única instancia (singleton) del servicio.
export const errorService = new ErrorService();
