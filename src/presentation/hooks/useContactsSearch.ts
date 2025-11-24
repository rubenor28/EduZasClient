import { useState, useEffect, useCallback } from "react";
import { apiPost } from "@application";
import type { PaginatedQuery, ContactCriteria } from "@application";
import type { Contact } from "@domain";

type UseContactsSearchOptions = {
  manual?: boolean;
  debounceMs?: number;
};

/**
 * Hook para manejar la búsqueda y paginación de contactos.
 * Este es un hook "controlado" que puede operar en modo automático o manual.
 *
 * @param endpoint El endpoint de la API para la búsqueda de contactos.
 * @param criteria El objeto de criterios para la búsqueda.
 * @param options Opciones para configurar el comportamiento del hook. `manual: true` deshabilita la búsqueda automática.
 * @returns Un objeto con el estado de la búsqueda y funciones para manipularla.
 */
export const useContactsSearch = (
  endpoint: string,
  criteria: ContactCriteria,
  options: UseContactsSearchOptions = {},
) => {
  const { manual = false, debounceMs = 300 } = options;

  const [data, setData] = useState<PaginatedQuery<Contact, ContactCriteria> | null>(null);
  const [isLoading, setIsLoading] = useState(!manual);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria);

  // Efecto para aplicar el debounce a los criterios
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCriteria(criteria);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [criteria, debounceMs]);

  const search = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiPost<PaginatedQuery<Contact, ContactCriteria>>(
        endpoint,
        debouncedCriteria,
      );
      setData(result);
    } catch (e) {
      const fetchError = e instanceof Error ? e : new Error("Error desconocido");
      setError(fetchError);
      console.error(`Error fetching contacts from ${endpoint}:`, fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, debouncedCriteria]);

  // Efecto para la búsqueda automática si no es manual
  useEffect(() => {
    if (!manual) {
      search();
    }
  }, [manual, search]);
  
  // Función para forzar una nueva búsqueda
  const refetch = useCallback(() => {
    search();
  }, [search]);

  return {
    data,
    isLoading,
    error,
    refetch,
    search,
  };
};
