import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@application";
import type { PaginatedQuery, ClassCriteria } from "@application";
import type { Class } from "@domain";

/**
 * Hook para manejar la búsqueda y paginación de clases.
 *
 * @param endpoint - El endpoint de la API para la búsqueda de clases (ej. '/classes/enrolled').
 * @param initialCriteria - Los criterios iniciales para la búsqueda.
 * @param debounceMs - El tiempo en milisegundos para el debounce de la búsqueda (def. 500ms).
 * @returns Un objeto con el estado de la búsqueda y funciones para manipularlo.
 */
export const useClassSearch = (
  endpoint: string,
  initialCriteria: ClassCriteria,
  debounceMs: number = 500,
) => {
  const [criteria, setCriteria] = useState<ClassCriteria>(initialCriteria);
  const [data, setData] = useState<PaginatedQuery<Class, ClassCriteria> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria);
  const [refetchIndex, setRefetchIndex] = useState(0); // Estado para el trigger de refetch

  // Efecto para aplicar el debounce a los criterios
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCriteria(criteria);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [criteria, debounceMs]);

  // Efecto para realizar la búsqueda cuando los criterios o el refetchIndex cambian
  useEffect(() => {
    const searchClasses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiClient.post<
          PaginatedQuery<Class, ClassCriteria>
        >(endpoint, debouncedCriteria);
        setData(result);
      } catch (e) {
        const fetchError =
          e instanceof Error ? e : new Error("Error desconocido");
        setError(fetchError);
        console.error(`Error fetching classes from ${endpoint}:`, fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    searchClasses();
  }, [endpoint, debouncedCriteria, refetchIndex]); // Dependencia en refetchIndex

  const resetSearch = useCallback(() => {
    setCriteria(initialCriteria);
  }, [initialCriteria]);

  // Función para forzar una nueva búsqueda
  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  return {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
    resetSearch,
    refetch,
  };
};
