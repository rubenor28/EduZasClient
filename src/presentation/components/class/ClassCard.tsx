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
import type { Class } from "@domain";
import { useState } from "react";

export type MenuOption = {
  name: string;
  callback: () => void;
};

type ClassCardProps = {
  classData: Class;
  isLoading: boolean;
  onClick: (id: string) => void;
  menuOptions?: MenuOption[];
};

export const ClassCard = ({
  classData,
  isLoading,
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
                mr: "40px",
              }}
              noWrap
            >
              {className}
            </Typography>
            {section && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {section}
              </Typography>
            )}
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
