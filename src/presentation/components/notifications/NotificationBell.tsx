import { useState, useEffect } from "react";
import { IconButton, Badge, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUser } from "../../context/UserContext";
import {
  apiGet,
  AppError,
  errorService,
  InternalServerError,
} from "@application";
import { NotificationList } from "./NotificationList";
import { AUTOMATED_FETCHS_ALLOWED } from "@domain";

const POLLING_INTERVAL = 30000; // 30 segundos

/**
 * Componente que muestra un icono de campana con un indicador de notificaciones.
 *
 * Responsabilidades:
 * 1. Consultar periódicamente si hay notificaciones sin leer.
 * 2. Mostrar una insignia en el icono si hay notificaciones nuevas.
 * 3. Abrir un Popover con la lista de notificaciones al hacer clic.
 */
export const NotificationBell = () => {
  const { user } = useUser();
  const [hasUnread, setHasUnread] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const fetchUnreadStatus = async () => {
    if (!AUTOMATED_FETCHS_ALLOWED) return;

    try {
      const unread = await apiGet<boolean>(
        `/notifications/unreaded/${user.id}`,
      );
      setHasUnread(unread);
    } catch (error) {
      const e = error instanceof AppError ? error : new InternalServerError();
      errorService.notify(e);
    }
  };

  useEffect(() => {
    fetchUnreadStatus(); // Primera consulta inmediata
    const intervalId = setInterval(fetchUnreadStatus, POLLING_INTERVAL);

    return () => clearInterval(intervalId); // Limpiar al desmontar
  }, [user.id]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // Al abrir, si había notificaciones, asumimos que el usuario las verá.
    // El indicador se quita inmediatamente para dar feedback rápido.
    // La lista de notificaciones mostrará el estado real (leído/no leído).
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Re-evaluar si quedan notificaciones sin leer al cerrar
    fetchUnreadStatus();
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge color="error" variant="dot" invisible={!hasUnread}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <NotificationList onClose={handleClose} />
      </Popover>
    </>
  );
};
