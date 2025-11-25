
import { Box, Pagination, Button } from "@mui/material";
import { type Criteria, type PaginatedQuery } from "@application";

/**
 * Props para el componente `PaginationControls`.
 * @template T - El tipo de dato de los resultados.
 * @template C - El tipo de criterio de búsqueda.
 */
interface PaginationControlsProps<T, C extends Criteria> {
  /**
   * Los datos paginados devueltos por el hook `usePaginatedSearch`.
   * Puede ser `undefined` si la búsqueda aún no se ha completado.
   */
  data: PaginatedQuery<T, C> | undefined;

  /**
   * La función para actualizar los criterios de búsqueda, proporcionada por `usePaginatedSearch`.
   * Se utiliza para cambiar de página.
   */
  setCriteria: React.Dispatch<React.SetStateAction<C>>;
  /**
   * Función para ir a la primera página.
   */
  firstPage: () => void;
  /**
   * Función para ir a la última página.
   */
  lastPage: () => void;
}

/**
 * Un componente reutilizable para mostrar controles de paginación (números de página).
 * Está diseñado para funcionar con los datos proporcionados por el hook `usePaginatedSearch`.
 *
 * @template T - El tipo de dato de los resultados.
 * @template C - El tipo de criterio de búsqueda que extiende `Criteria`.
 *
 * @example
 * const { data, criteria, setCriteria, firstPage, lastPage } = usePaginatedSearch<MyType, MyCriteria>("/my-endpoint", { page: 1 });
 *
 * // ... en el JSX
 * <PaginationControls data={data} setCriteria={setCriteria} firstPage={firstPage} lastPage={lastPage} />
 */
export const PaginationControls = <T, C extends Criteria>({
  data,
  setCriteria,
  firstPage,
  lastPage,
}: PaginationControlsProps<T, C>) => {
  if (!data || data.totalPages <= 1) {
    return null; // No renderizar si no hay datos o solo hay una página
  }

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCriteria((prev) => ({ ...prev, page: value }));
  };

  const isFirstPage = data.page === 1;
  const isLastPage = data.page === data.totalPages;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Align items vertically
        gap: 2, // Spacing between items
        mt: 4,
      }}
    >
      <Button
        onClick={firstPage}
        disabled={isFirstPage}
        variant="outlined"
        size="small"
      >
        Primera
      </Button>
      <Pagination
        count={data.totalPages}
        page={data.page}
        onChange={handlePageChange}
        color="primary"
        size="large"
      />
      <Button
        onClick={lastPage}
        disabled={isLastPage}
        variant="outlined"
        size="small"
      >
        Última
      </Button>
    </Box>
  );
};
