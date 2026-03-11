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
 * Opciones de configuración para el gancho de búsqueda paginada.
 */
type SearchOptions = {
  /** Indica si la búsqueda debe ejecutarse automáticamente al montar el componente. @default true */
  autoFetch?: boolean;
  /** Indica si los errores deben notificarse automáticamente al servicio global de errores. @default true */
  autoErrorHandling?: boolean;
  /** Tiempo de espera en milisegundos para el retraso (debounce) de los criterios de búsqueda. @default 300 */
  debounceMs?: number;
};

/**
 * Gancho genérico para gestionar búsquedas paginadas contra la API.
 * 
 * Este gancho automatiza el manejo del estado de carga, la gestión de errores, 
 * el retraso de las consultas (debounce) y la lógica de navegación entre páginas.
 * 
 * @param endpoint Ruta del endpoint de búsqueda en la API.
 * @param initialCriteria Criterios iniciales de filtrado y paginación.
 * @param options Configuración adicional para el comportamiento del gancho.
 * @returns Un objeto con el estado de la búsqueda y funciones de control de paginación.
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
