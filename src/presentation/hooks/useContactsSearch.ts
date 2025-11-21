import { useState, useEffect, useCallback } from "react";
import { apiPost } from "@application";
import type { PaginatedQuery, ContactCriteria } from "@application";
import type { Contact } from "@domain";

/**
 * Hook para manejar la búsqueda y paginación de contactos.
 * Este es un hook "controlado", lo que significa que los criterios de búsqueda
 * son pasados como props desde el componente padre.
 *
 * @param endpoint - El endpoint de la API para la búsqueda de contactos.
 * @param criteria - El objeto de criterios para la búsqueda. El hook reaccionará a los cambios en este objeto.
 * @param debounceMs - El tiempo en milisegundos para el debounce de la búsqueda (def. 300ms).
 * @returns Un objeto con el estado de la búsqueda y una función para forzar la recarga.
 */
export const useContactsSearch = (
  endpoint: string,
  criteria: ContactCriteria,
  debounceMs: number = 300,
) => {
  const [data, setData] = useState<PaginatedQuery<Contact, ContactCriteria> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria);
  const [refetchIndex, setRefetchIndex] = useState(0);

  // Efecto para aplicar el debounce a los criterios que vienen de las props
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCriteria(criteria);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [criteria, debounceMs]);

  // Efecto para realizar la búsqueda cuando los criterios (debounced) o el refetchIndex cambian
  useEffect(() => {
    const searchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiPost<
          PaginatedQuery<Contact, ContactCriteria>
        >(endpoint, debouncedCriteria);
        setData(result);
      } catch (e) {
        const fetchError =
          e instanceof Error ? e : new Error("Error desconocido");
        setError(fetchError);
        console.error(`Error fetching contacts from ${endpoint}:`, fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    searchContacts();
  }, [endpoint, debouncedCriteria, refetchIndex]);

  // Función para forzar una nueva búsqueda con los mismos criterios
  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
