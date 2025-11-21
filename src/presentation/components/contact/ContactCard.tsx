import type { Contact } from "@domain";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type ContactCardProps = {
  contact: Contact;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

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
