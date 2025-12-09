import type { Block } from "@blocknote/core";

/** Representa un recurso académico (ej. notas de clase). */
export type Resource = {
    /** Identificador único del recurso. */
    id: string;
    /** Indica si el recurso está activo. */
    active: boolean;
    /** Título del recurso. */
    title: string;
    /** Color de la tarjeta del recurso. */
    color: string;
    /** Contenido del recurso en formato de bloques (BlockNote). */
    content: Block[];
    /** ID del profesor autor del recurso. */
    professorId: number;
};
