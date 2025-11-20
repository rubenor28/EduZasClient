import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { Class } from "@domain";
import { useState } from "react";

/**
 * Define la estructura para una opción del menú desplegable.
 */
export type MenuOption = {
  name: string;
  callback: () => void;
};

/**
 * Props para el componente ClassCard.
 */
type ClassCardProps = {
  /** El objeto de la clase a mostrar. */
  classData: Class;
  /** Función a ejecutar cuando se hace clic en la tarjeta. */
  onClick: (id: string) => void;
  /** Opciones dinámicas para el menú de la tarjeta (opcional). */
  menuOptions?: MenuOption[];
};

/**
 * Componente de tarjeta para mostrar información de una clase,
 * con un estilo inspirado en Google Classroom.
 */
export const ClassCard = ({
  classData,
  onClick,
  menuOptions = [],
}: ClassCardProps) => {
  const { id, className, subject, section, color } = classData;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleCardClick = () => {
    onClick(id);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // Detiene la propagación para que no se active el onClick de la tarjeta.
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (_event: object, _reason: "backdropClick" | "escapeKeyDown") => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent,
    callback: () => void,
  ) => {
    event.stopPropagation();
    callback();
    setAnchorEl(null); // Cierra el menú directamente
  };

  return (
    <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 3 }}>
      <CardActionArea onClick={handleCardClick} component="div">
        <Box
          sx={{
            height: 100,
            backgroundColor: color || "primary.main",
            position: "relative",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                mr: "40px", // Margen derecho para no solapar el icono
              }}
              noWrap
            >
              {className}
            </Typography>
            {section && (
              <Typography variant="subtitle1" sx={{ color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.2)" }}>
                {section}
              </Typography>
            )}
          </Box>
          {menuOptions.length > 0 && (
            <IconButton
              aria-label="opciones"
              onClick={handleMenuClick}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "white",
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
        <CardContent sx={{ height: 80 }}>
          {subject && (
            <Typography variant="body2" color="text.secondary">
              {subject}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el menú se propague a la tarjeta
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem
            key={option.name}
            onClick={(e) => handleMenuItemClick(e, option.callback)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};
