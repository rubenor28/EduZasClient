import type { Criteria, StringQuery } from "./common";
import type { Block } from "@blocknote/core";

/** DTO que representa un recurso académico completo. */
export type Resource = {
  /** Identificador único del recurso. */
  id: string;
  /** Indica si el recurso está activo. */
  active: boolean;
  /** Título del recurso. */
  title: string;
  /** Contenido del recurso (bloques). */
  content: Block[];
  /** ID del profesor autor. */
  professorId: number;
};

/** DTO para la creación de un nuevo recurso. */
export type NewResource = {
  /** Título del recurso. */
  title: string;
  /** Contenido inicial del recurso. */
  content: Block[];
  /** ID del profesor que crea el recurso. */
  professorId: number;
};

/** DTO para la actualización de un recurso existente. */
export type ResourceUpdate = {
  /** ID del recurso a actualizar. */
  id: string;
  /** Estado de activación. */
  active: boolean;
  /** Nuevo título. */
  title: string;
  /** Nuevo contenido. */
  content: Block[];
  /** ID del profesor propietario. */
  professorId: number;
};

/** Criterios de búsqueda para recursos. */
export type ResourceCriteria = Criteria & {
  /** Filtrar por título. */
  title?: StringQuery;
  /** Filtrar por estado activo. */
  active?: boolean;
  /** Filtrar por ID del profesor. */
  professorId?: number;
  /** Filtrar por ID de clase asociada. */
  classId?: string;
};

/** Resumen de un recurso para listados. */
export type ResourceSummary = {
  /** Identificador del recurso. */
  id: string;
  /** Estado de activación. */
  active: boolean;
  /** Título del recurso. */
  title: string;
  /** ID del profesor autor. */
  professorId: number;
};

/** Estado de asociación entre un recurso y una clase. */
export type ClassResourceAssociation = {
  /** ID del recurso. */
  resourceId: string;
  /** ID de la clase. */
  classId: string;
  /** Nombre de la clase. */
  className: string;
  /** Indica si el recurso está asociado a la clase. */
  isAssociated: boolean;
  /** Indica si el recurso está oculto en la clase. */
  isHidden: boolean;
};

/** Criterios para buscar asociaciones de recursos con clases. */
export type ClassResourceAssociationCriteria = Criteria & {
  /** ID del profesor que consulta. */
  professorId: number;
  /** ID del recurso. */
  resourceId: string;
};

/** Relación simple entre clase y recurso. */
export type ClassResource = {
  /** ID de la clase. */
  classId: string;
  /** ID del recurso. */
  resourceId: string;
  /** Indica si el recurso está oculto. */
  hidden: boolean;
}
