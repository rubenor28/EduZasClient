/**
 * Métricas generales de uso para un recurso específico.
 */
export type ResourceMetrics = {
  /** Número total de visualizaciones. */
  readonly totalViews: number;
  /** Número de estudiantes distintos que han visto el recurso. */
  readonly uniqueStudentsCount: number;
  /** Tiempo promedio de visualización en minutos. */
  readonly averageDurationMinutes: number;
  /** Tiempo total acumulado de visualización en minutos. */
  readonly totalTimeSpentMinutes: number;
}

/**
 * Detalle de la actividad de un estudiante individual en un recurso.
 */
export type StudentActivityDetail = {
  /** ID del estudiante. */
  readonly userId: number;
  /** Nombre completo del estudiante. */
  readonly fullName: string;
  /** Número de veces que ha visto el recurso. */
  readonly viewCount: number;
  /** Tiempo total que ha pasado viendo el recurso en minutos. */
  readonly totalMinutesSpent: number;
  /** Fecha y hora de la última visualización (ISO 8601). */
  readonly lastViewed: string;
};

/**
 * Respuesta completa del reporte de un recurso para una clase específica.
 */
export type ResourceClassReportResponse = {
  /** ID del recurso. */
  readonly resourceId: string;
  /** Título del recurso. */
  readonly resourceTitle: string;
  /** ID de la clase. */
  readonly classId: string;
  /** Métricas resumidas. */
  readonly summary: ResourceMetrics;
  /** Lista detallada de actividad por estudiante. */
  readonly students: StudentActivityDetail[];
};
