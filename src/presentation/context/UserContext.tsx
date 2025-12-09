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
 * Estructura de datos que provee el contexto de usuario.
 * Garantiza que los consumidores reciban un objeto `User` válido.
 */
type UserContextType = {
  /** El usuario autenticado actualmente. */
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
 * Proveedor de contexto que gestiona la sesión del usuario.
 *
 * Responsabilidades:
 * 1. Obtener el usuario actual desde la API (`/auth/me`).
 * 2. Mostrar un indicador de carga (`CircularProgress`) durante la petición.
 * 3. Redirigir al login si el usuario no está autenticado (error 401).
 * 4. Exponer el usuario a los componentes hijos una vez cargado.
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
 * Hook personalizado para consumir el contexto de usuario.
 *
 * @throws {Error} Si se usa fuera de un `UserProvider`.
 * @returns El objeto `UserContextType` con el usuario autenticado.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
