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

    tagText: string,

  ) => Promise<void>;

  removeTag: (

    agendaOwnerId: number,

    contactId: number,

    tagText: string,

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

      async (agendaOwnerId: number, contactId: number, tagText: string) => {

        if (tags.some((t) => t.text === tagText)) return; // Evitar duplicados

  

        const originalTags = [...tags];

        try {

          // No optimistic update. Call API first.

          await apiPost("/contacts/tags", {

            agendaOwnerId,

            userId: contactId,

            tagText,

          });

          // On success, refetch all tags to get the new state with the new ID.

          await fetchTags(agendaOwnerId, contactId);

        } catch (e) {

          setError("Error al añadir la etiqueta. Inténtalo de nuevo.");

          setTags(originalTags); // Revertir cambios si falla

          console.error("Failed to add tag:", e);

        }

      },

      [tags, fetchTags],

    );



  /**

   * Elimina una etiqueta del contacto.

   * Si la etiqueta tiene un ID, la elimina del backend. Si no, solo la quita del estado local.

   */

  const removeTag = useCallback(

    async (agendaOwnerId: number, contactId: number, tagText: string) => {

      const originalTags = [...tags];

      const tagToRemove = originalTags.find((t) => t.text === tagText);



      if (!tagToRemove) return; // No se encontró la etiqueta a eliminar



      const optimisticTags = originalTags.filter((t) => t.text !== tagText);

      setTags(optimisticTags); // Actualización optimista



      // Si la etiqueta tiene un ID, significa que existe en el backend y debemos llamar a la API

      if (tagToRemove.id !== undefined) {

        try {

          await apiDelete(

            `/contacts/tags/${agendaOwnerId}/${contactId}/${tagToRemove.id}`,

          );

        } catch (e) {

          setError("Error al eliminar la etiqueta. Inténtalo de nuevo.");

          setTags(originalTags); // Revertir en caso de fallo

          console.error("Failed to remove tag:", e);

        }

      }

    },

    [tags],

  );



  return { tags, isLoading, error, fetchTags, addTag, removeTag };

};


