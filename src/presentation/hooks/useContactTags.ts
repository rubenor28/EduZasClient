import { useState, useCallback } from "react";
import { apiPost, apiDelete } from "@application";
import type { PaginatedQuery, TagCriteria } from "@application";
import type { Tag } from "domain/tag";

type UseContactTagsReturn = {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: (agendaOwnerId: number, contactId: number) => Promise<void>;
  addTag: (
    agendaOwnerId: number,
    contactId: number,
    tag: string,
  ) => Promise<void>;
  removeTag: (
    agendaOwnerId: number,
    contactId: number,
    tag: string,
  ) => Promise<void>;
};

/**
 * Hook para gestionar las etiquetas (tags) de un contacto.
 * Implementa "Optimistic UI" para añadir y eliminar etiquetas instantáneamente,
 * revirtiendo los cambios si la API falla.
 *
 * @returns Estado de las etiquetas y funciones para manipularlas.
 */
export const useContactTags = (): UseContactTagsReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todas las etiquetas de un contacto.
   * Maneja la paginación automáticamente para traer todos los resultados.
   */
  const fetchTags = useCallback(
    async (agendaOwnerId: number, contactId: number) => {
      setIsLoading(true);
      setError(null);
      try {
        let page = 1;
        let search: PaginatedQuery<Tag, TagCriteria>;
        let results: Tag[] = [];

        // Bucle para obtener todas las páginas de etiquetas
        do {
          const criteria: TagCriteria = {
            agendaOwnerId,
            contactId,
            page,
          };

          search = await apiPost<PaginatedQuery<Tag, TagCriteria>>(
            "/contacts/tags/search",
            criteria,
          );

          results.push(...search.results);
          page++; // Avanzar a la siguiente página
        } while (search.totalPages >= page);
        setTags(results);
      } catch (e) {
        const fetchError =
          e instanceof Error ? e.message : "Error al cargar etiquetas";
        setError(fetchError);
        console.error("Failed to fetch tags:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Añade una etiqueta al contacto.
   * Actualiza el estado local inmediatamente (optimistic update) y luego llama a la API.
   */
  const addTag = useCallback(
    async (agendaOwnerId: number, contactId: number, tag: string) => {
      if (tags.map((t) => t.text).includes(tag)) return; // Evitar duplicados

      let newTag: Tag = {
        text: tag,
        createdAt: new Date(Date.now()),
      };

      const optimisticTags = [...tags, newTag];
      setTags(optimisticTags); // Actualización optimista

      try {
        await apiPost("/contacts/tags", {
          agendaOwnerId,
          userId: contactId,
          tag,
        });
      } catch (e) {
        setError("Error al añadir la etiqueta. Inténtalo de nuevo.");
        setTags(tags); // Revertir cambios si falla
        console.error("Failed to add tag:", e);
      }
    },
    [tags],
  );

  /**
   * Elimina una etiqueta del contacto.
   * Actualiza el estado local inmediatamente (optimistic update) y luego llama a la API.
   */
  const removeTag = useCallback(
    async (agendaOwnerId: number, contactId: number, tag: string) => {
      const optimisticTags = tags.filter((t) => t.text !== tag);
      setTags(optimisticTags); // Actualización optimista

      try {
        await apiDelete(`/contacts/tags/${agendaOwnerId}/${contactId}/${tag}`);
      } catch (e) {
        setError("Error al eliminar la etiqueta. Inténtalo de nuevo.");
        setTags(tags); // Revertir cambios si falla
        console.error("Failed to remove tag:", e);
      }
    },
    [tags],
  );

  return { tags, isLoading, error, fetchTags, addTag, removeTag };
};
