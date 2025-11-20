import type { User } from "@domain";
import { apiGetAuth } from "@application";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

/**
 * Define el tipo de valor que contendrá el contexto de usuario.
 * Forzamos que siempre sea un objeto `User` para los consumidores del contexto.
 */
type UserContextType = {
  user: User;
};

/**
 * Creación del contexto de usuario.
 * Se inicializa con `null` pero el `UserProvider` se asegurará de que nunca
 * sea `null` para los componentes hijos.
 */
const UserContext = createContext<UserContextType | null>(null);

/**
 * Props para el UserProvider.
 */
type UserProviderProps = {
  children: ReactNode;
};

/**
 * Componente proveedor que obtiene los datos del usuario y los
 * pone a disposición de sus hijos a través del `UserContext`.
 *
 * Muestra una pantalla de carga mientras se obtienen los datos y
 * redirige al login si el usuario no está autenticado.
 */
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await apiGetAuth<User>("/auth/me");

      result.match(
        (userData) => {
          setUser(userData);
        },
        (error) => {
          if (error.type !== "unauthorized") throw new Error();
          navigate("/login");
        },
      );

      setIsLoading(false);
    };

    fetchUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return (
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    );
  }

  // No renderiza nada si no hay usuario, ya que la redirección está en curso.
  return null;
};

/**
 * Hook personalizado para acceder a los datos del usuario desde el contexto.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
