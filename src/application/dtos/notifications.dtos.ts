import type { Criteria } from "./common";

/**
 * DTO con el resumen de una notificación para mostrar al usuario.
 * Corresponde al `NotificationSummaryDTO` del backend.
 */
export interface NotificationSummary {
  /** ID de la notificación. */
  id: number;
  /** Indica si la notificación ha sido leída. */
  readed: boolean;
  /** Título de la notificación. */
  title: string;
  /** ID de la clase a la que pertenece la notificación. */
  classId: string;
  /** Fecha de publicación de la notificación. */
  publishDate: string;
}

/**
 * Criterios para la búsqueda de notificaciones de un usuario.
 * Corresponde al `NotificationSummaryCriteriaDTO` del backend.
 */
export interface NotificationSummaryCriteria extends Criteria {
  /** ID del usuario para el que se buscan las notificaciones. */
  userId: number;
  /** Filtra las notificaciones por su estado de lectura (leídas o no leídas). */
  readed?: boolean;
}

/**
 * DTO para marcar una notificación como leída.
 * Corresponde al DTO que espera el endpoint `PUT /notifications/read`.
 */
export interface MarkAsReadDTO {
  notificationId: number;
  userId: number;
}
