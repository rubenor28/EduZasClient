import type { Criteria } from "./common";

/**
 * Tipos de contenido en una clase.
 * Los valores numéricos corresponden a los valores del enum del backend.
 */
export enum ContentType {
  /** Evaluación / Test */
  TEST = 0,
  /** Recurso académico */
  RESOURCE = 1,
}

/**
 * Mapeo de valores numéricos a etiquetas legibles.
 */
export const ContentTypeLabels: Record<ContentType, string> = {
  [ContentType.TEST]: "Evaluación",
  [ContentType.RESOURCE]: "Recurso",
};

/**
 * Convierte un valor numérico o string al enum ContentType.
 */
export function parseContentType(value: number | string): ContentType {
  if (typeof value === "number") {
    return value as ContentType;
  }
  // Si es string, convertir a número
  const numValue = parseInt(value, 10);
  if (isNaN(numValue) || !(numValue in ContentType)) {
    return ContentType.RESOURCE; // Default
  }
  return numValue as ContentType;
}

/**
 * Representa un elemento de contenido (test o recurso) asignado a una clase.
 */
export interface ClassContentDTO {
  /** ID único del contenido (TestId o ResourceId). */
  id: string;
  /** Título del contenido. */
  title: string;
  /** Tipo de contenido como número (0=TEST, 1=RESOURCE) desde el backend. */
  type: number | ContentType;
  /** Si el recurso esta oculto para los alumnos. */
  hiden: boolean;
  /** Fecha en que fue asignado el contenido a la clase. */
  publishDate: string;
}

/**
 * Criterios de búsqueda para contenido de una clase.
 */
export interface ClassContentCriteria extends Criteria {
  /** ID de la clase para la que obtener el contenido. */
  classId: string;
  /** Filtro opcional por título del contenido. */
  title?: { text: string; searchType: string };
  /** Filtro opcional por visibilidad. */
  visible?: boolean;
  /** Filtro opcional por tipo de contenido. */
  type?: ContentType;
}
