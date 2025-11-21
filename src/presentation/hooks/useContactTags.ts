import { useState, useCallback } from "react";
import { apiPost, apiDelete } from "@application";
import type { PaginatedQuery, TagCriteria } from "@application";

type UseContactTagsReturn = {
  tags: string[];
  isLoading: boolean;
  error: string | null;
  fetchTags: (agendaOwnerId: number, contactId: number) => Promise<void>;
  addTag: (agendaOwnerId: number, contactId: number, tag: string) => Promise<void>;
  removeTag: (agendaOwnerId: number, contactId: number, tag: string) => Promise<void>;
};

export const useContactTags = (): UseContactTagsReturn => {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async (agendaOwnerId: number, contactId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const criteria: TagCriteria = {
        agendaOwnerId,
        contactId,
        page: 1,
        pageSize: 100, // Asumimos que un contacto no tendrá más de 100 etiquetas
      };
      const result = await apiPost<PaginatedQuery<string, TagCriteria>>(
        "/contacts/tags/search",
        criteria,
      );
      setTags(result.results);
    } catch (e) {
      const fetchError = e instanceof Error ? e.message : "Error al cargar etiquetas";
      setError(fetchError);
      console.error("Failed to fetch tags:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTag = useCallback(
    async (agendaOwnerId: number, contactId: number, tag: string) => {
      if (tags.includes(tag)) return; // No añadir duplicados

      const optimisticTags = [...tags, tag];
      setTags(optimisticTags); // Actualización optimista

      try {
        await apiPost("/contacts/tags", { agendaOwnerId, userId: contactId, tag });
      } catch (e) {
        setError("Error al añadir la etiqueta. Inténtalo de nuevo.");
        setTags(tags); // Revertir en caso de error
        console.error("Failed to add tag:", e);
      }
    },
    [tags],
  );

  const removeTag = useCallback(
    async (agendaOwnerId: number, contactId: number, tag: string) => {
      const optimisticTags = tags.filter((t) => t !== tag);
      setTags(optimisticTags); // Actualización optimista

      try {
        await apiDelete(`/contacts/tags/${agendaOwnerId}/${contactId}/${tag}`);
      } catch (e) {
        setError("Error al eliminar la etiqueta. Inténtalo de nuevo.");
        setTags(tags); // Revertir en caso de error
        console.error("Failed to remove tag:", e);
      }
    },
    [tags],
  );

  return { tags, isLoading, error, fetchTags, addTag, removeTag };
};
