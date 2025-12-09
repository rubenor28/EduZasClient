import type { Contact } from "@domain";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Props para el componente ContactCard.
 */
type ContactCardProps = {
  /** Datos del contacto a mostrar. */
  contact: Contact;
  /** Callback al hacer click en la tarjeta (navegación). */
  onClick: () => void;
  /** Callback al hacer click en editar. */
  onEdit: () => void;
  /** Callback al hacer click en eliminar. */
  onDelete: () => void;
};

/**
 * Tarjeta simple para mostrar un contacto en la lista.
 * Muestra el alias del contacto y botones para editar o eliminar.
 */
export const ContactCard = ({
  contact,
  onClick,
  onEdit,
  onDelete,
}: ContactCardProps) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" textAlign="center">
            {contact.alias}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "center" }}>
        <IconButton aria-label="edit" onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
