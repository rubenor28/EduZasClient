import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { apiClient } from "@application";
import type { User } from "@domain";

export const HomeNavbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await apiClient.get<User>("/auth/me");
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => await apiClient.delete("/auth/logout");

  const getDisplayName = (user: User | null) => {
    if (!user) return "Invitado";
    if (user.midName) {
      return `${user.firstName} ${user.midName}`;
    }
    return user.firstName;
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ¡Hola {getDisplayName(user)}!
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};
