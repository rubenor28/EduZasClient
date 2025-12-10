import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import type { NotificationSummary } from "@application";
import { useNavigate } from "react-router-dom";
import { apiPut } from "@application";
import { useUser } from "../../context/UserContext";
import CircleIcon from "@mui/icons-material/Circle";
import { useState } from "react";

interface NotificationItemProps {
  notification: NotificationSummary;
  onClose: () => void;
}

/**
 * Muestra un único elemento de notificación en la lista.
 *
 * Responsabilidades:
 * 1. Mostrar el título y la fecha de la notificación.
 * 2. Mostrar un indicador visual si la notificación no ha sido leída.
 * 3. Manejar el clic para marcarla como leída y navegar a la clase correspondiente.
 */
export const NotificationItem = ({
  notification,
  onClose,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isRead, setIsRead] = useState(notification.readed);

  const handleClick = async () => {
    if (!isRead) {
      try {
        await apiPut(
          "/notifications/read",
          {
            notificationId: notification.id,
            userId: user.id,
          },
          { parseResponse: "void" }
        );
        setIsRead(true);
      } catch (error) {
        // En un escenario real, podríamos notificar al usuario del error.
        console.error("Failed to mark notification as read", error);
      }
    }
    onClose();
    navigate(`/student/classes/${notification.classId}/content`);
  };

  return (
    <ListItem
      button
      onClick={handleClick}
      sx={{
        backgroundColor: isRead ? "transparent" : "action.hover",
        "&:hover": {
          backgroundColor: isRead ? "action.hover" : "action.selected",
        },
        mb: 1,
        borderRadius: 1,
      }}
    >
      <ListItemIcon sx={{ minWidth: "auto", mr: 1.5 }}>
        {!isRead && <CircleIcon sx={{ fontSize: 10, color: "primary.main" }} />}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ fontWeight: isRead ? 400 : 600 }}>
            {notification.title}
          </Typography>
        }
        secondary={new Date(notification.publishDate).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      />
    </ListItem>
  );
};
