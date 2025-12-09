import {
  apiPost,
  errorService,
  type Criteria,
  type PaginatedQuery,
  AppError,
  InternalServerError,
} from "@application";
import { useState, useEffect, useCallback } from "react";

/**
 * Opciones de configuración para la búsqueda paginada.
 */
type SearchOptions = {
  /** Si es `true`, la búsqueda se ejecuta automáticamente al montar el componente. */
  autoFetch?: boolean;
  /** Si es `true`, los errores se envían automáticamente al servicio de errores global. */
  autoErrorHandling?: boolean;
  /** Tiempo de espera en ms para el debounce de los criterios de búsqueda. */
  debounceMs?: number;
};

/**
 * Hook genérico para gestionar búsquedas paginadas contra la API.
 * Maneja automáticamente el estado de carga, errores, debounce y paginación.
 *
 * @param endpoint - URL del endpoint de búsqueda (ej. `/users/search`).
 * @param initialCriteria - Criterios iniciales de búsqueda (filtros, página, etc.).
 * @param options - Opciones adicionales de configuración.
 * @returns Objeto con los resultados, estado y funciones de control (siguiente página, refrescar, etc.).
 */
export function usePaginatedSearch<T, C extends Criteria>(
  endpoint: string,
  initialCriteria: C,
  options: SearchOptions = {},
) {
  const {
    debounceMs = 300,
    autoFetch = true,
    autoErrorHandling = true,
  } = options;

  const [criteria, setCriteria] = useState(initialCriteria);
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria);

  const [data, setData] = useState<PaginatedQuery<T, C> | null>(null);
  const [isLoading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<AppError | null>(null);

  // Efecto para aplicar el debounce a los criterios.
  // Evita hacer peticiones por cada tecla pulsada en un campo de búsqueda.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCriteria(criteria);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [criteria, debounceMs]);

  // Función principal de búsqueda.
  // Se ejecuta cuando cambian los criterios "debounced" o el endpoint.
  const search = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await apiPost<PaginatedQuery<T, C>>(
        endpoint,
        debouncedCriteria,
      );
      setData(s);
    } catch (e) {
      let error: AppError;

      // Normalización de errores
      if (e instanceof AppError) {
        error = e;
      } else if (e instanceof Error) {
        error = new InternalServerError(e.message, e.stack);
      } else {
        error = new InternalServerError(
          `Error inesperado al consultar ${endpoint}`,
        );
      }

      if (autoErrorHandling) errorService.notify(error);
      else setError(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, debouncedCriteria, autoErrorHandling]);

  // Busqueda automatica si se configura autoFetch
  useEffect(() => {
    if (autoFetch) search();
  }, [autoFetch, search]);

  // Funcion para refrescar busqueda
  const refreshSearch = useCallback(() => {
    search();
  }, [search]);

  // Funciones para paginación que actualizan el estado correctamente
  const nextPage = () => {
    const page = data?.page ?? 1;
    const totalPages = data?.totalPages ?? 1;

    if (page >= totalPages) return;

    setCriteria((prev) => ({ ...prev, page: page + 1 }));
  };

  const prevPage = () => {
    const page = data?.page ?? 1;

    if (page <= 1) return;

    setCriteria((prev) => ({ ...prev, page: page - 1 }));
  };

  const firstPage = () => {
    setCriteria((prev) => ({ ...prev, page: 1 }));
  };

  const lastPage = () => {
    setCriteria((prev) => ({ ...prev, page: data?.totalPages ?? 1 }));
  };

  return {
    data,
    criteria,
    setCriteria,
    isLoading,
    error,
    refreshSearch,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
}
