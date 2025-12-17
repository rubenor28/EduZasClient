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
import { useState } from "react";
import type { TestSummary } from "@application";
import type { MenuOption } from "@presentation";

/**
 * Props para el componente {@link TestCard}.
 */
type TestCardProps = {
  /** Datos de resumen del examen a mostrar. */
  testData: TestSummary;
  /** Callback que se invoca cuando se hace clic en la tarjeta del examen. */
  onClick: (id: string) => void;
  /**
   * Indica si la tarjeta está en estado de carga, mostrando un indicador.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Opciones del menú contextual de la tarjeta.
   * @default []
   */
  menuOptions?: MenuOption[];
};

/**
 * Componente que muestra una tarjeta de resumen para un examen.
 *
 * Incluye el título del examen, la fecha de última modificación,
 * un indicador de estado (activo/archivado), y un menú contextual
 * para acciones adicionales. Soporta un estado de carga visual.
 * @param props - Las propiedades del componente.
 */
export const TestCard = ({
  testData,
  onClick,
  isLoading = false,
  menuOptions = [],
}: TestCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleOptionClick = (
    event: React.MouseEvent<HTMLElement>,
    callback: () => void,
  ) => {
    event.stopPropagation();
    callback();
    handleMenuClose();
  };

  const formattedDate = new Date(testData.modifiedAt).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: `5px solid ${testData.color}`,
        opacity: testData.active ? 1 : 0.6,
      }}
    >
      <CardActionArea
        onClick={() => !isLoading && onClick(testData.id)}
        disabled={isLoading}
        sx={{ flexGrow: 1 }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {testData.title}
            </Typography>
            {menuOptions.length > 0 && (
              <IconButton
                aria-label="settings"
                onClick={handleMenuClick}
                sx={{ mt: -1, mr: -1 }}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Modificado: {formattedDate}
          </Typography>
          {!testData.active && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              Archivado
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose()}>
        {menuOptions.map((option) => (
          <MenuItem
            key={option.name}
            onClick={(e) => handleOptionClick(e, option.callback)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};
