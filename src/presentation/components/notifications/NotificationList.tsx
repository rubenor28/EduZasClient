import {
  Box,
  Typography,
  CircularProgress,
  Button,
  List,
  Divider,
} from "@mui/material";
import {
  type NotificationSummary,
  type NotificationSummaryCriteria,
} from "@application";
import { NotificationItem } from "./NotificationItem";
import { usePaginatedSearch, useUser } from "@presentation";

interface NotificationListProps {
  onClose: () => void;
}

/**
 * Muestra una lista paginada de notificaciones.
 *
 * Responsabilidades:
 * 1. Usar `usePaginatedSearch` para obtener las notificaciones del usuario.
 * 2. Mostrar un estado de carga o un mensaje si no hay notificaciones.
 * 3. Renderizar la lista de `NotificationItem`.
 * 4. Proveer controles de paginación.
 */
export const NotificationList = ({ onClose }: NotificationListProps) => {
  const { user } = useUser();
  const { data, isLoading, nextPage, prevPage, criteria, setCriteria } =
    usePaginatedSearch<NotificationSummary, NotificationSummaryCriteria>(
      "/notifications",
      {
        userId: user.id,
        page: 1,
        pageSize: 5,
      },
      { autoFetch: true, debounceMs: 0 },
    );

  const handleFilterToggle = (read: boolean | undefined) => {
    setCriteria((prev) => ({ ...prev, readed: read, page: 1 }));
  };

  return (
    <Box sx={{ p: 2, width: 360 }}>
      <Typography variant="h6" gutterBottom>
        Notificaciones
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button
          size="small"
          variant={criteria.readed === undefined ? "contained" : "outlined"}
          onClick={() => handleFilterToggle(undefined)}
        >
          Todas
        </Button>
        <Button
          size="small"
          variant={criteria.readed === false ? "contained" : "outlined"}
          onClick={() => handleFilterToggle(false)}
        >
          No Leídas
        </Button>
      </Box>
      <Divider sx={{ mb: 1 }} />
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && data && data.results.length > 0 && (
        <List>
          {data.results.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </List>
      )}
      {!isLoading && (!data || data.results.length === 0) && (
        <Typography sx={{ textAlign: "center", p: 2 }}>
          No hay notificaciones.
        </Typography>
      )}
      {data && data.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={prevPage} disabled={data.page === 1}>
            Anterior
          </Button>
          <Typography>
            Página {data.page} de {data.totalPages}
          </Typography>
          <Button onClick={nextPage} disabled={data.page === data.totalPages}>
            Siguiente
          </Button>
        </Box>
      )}
    </Box>
  );
};
