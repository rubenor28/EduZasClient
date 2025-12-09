import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { ResourceSummary } from "@application";
import { useState } from "react";
import BookIcon from '@mui/icons-material/Book';
import type { MenuOption } from "presentation/types";

/**
 * Props para el componente ResourceCard.
 */
type ResourceCardProps = {
  /** Datos resumidos del recurso. */
  resourceData: ResourceSummary;
  /** Indica si se está cargando alguna acción. */
  isLoading: boolean;
  /** Callback al hacer click en la tarjeta. */
  onClick: (id: string) => void;
  /** Opciones del menú contextual. */
  menuOptions?: MenuOption[];
};

/**
 * Tarjeta para mostrar un recurso académico en la lista.
 * Muestra el título y un icono representativo.
 */
export const ResourceCard = ({
  resourceData,
  isLoading,
  onClick,
  menuOptions = [],
}: ResourceCardProps) => {
  const { id, title, color } = resourceData;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleCardClick = () => {
    onClick(id);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent,
    callback: () => void,
  ) => {
    event.stopPropagation();
    callback();
    setAnchorEl(null);
  };

  return (
    <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 3 }}>
      <CardActionArea onClick={handleCardClick} component="div">
        <Box
          sx={{
            height: 100,
            backgroundColor: color,
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
                mr: "40px",
              }}
              noWrap
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              menuOptions.length > 0 && (
                <IconButton
                  aria-label="opciones"
                  onClick={handleMenuClick}
                  sx={{ color: "white" }}
                >
                  <MoreVertIcon />
                </IconButton>
              )
            )}
          </Box>
        </Box>
        <CardContent sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookIcon color="action" sx={{ fontSize: 40 }} />
        </CardContent>
      </CardActionArea>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
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
