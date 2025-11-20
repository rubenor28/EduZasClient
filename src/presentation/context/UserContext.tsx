import type { User } from "@domain";
import { apiClient, UnauthorizedError } from "@application";
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
      try {
        const userData = await apiClient.get<User>("/auth/me");
        setUser(userData);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          // Si el usuario no está autenticado, redirigir a la página de login.
          navigate("/login");
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
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

  // Solo renderiza los hijos si tenemos un usuario y la carga ha terminado.
  // El `user` aquí nunca será `null` gracias al `if (isLoading)`
  // que cubre el estado inicial.
  if (user) {
    return (
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    );
  }

  // Este return es por si algo sale mal y no se redirige,
  // para no renderizar nada.
  return null;
};

/**
 * Hook personalizado para acceder a los datos del usuario desde el contexto.
 *
 * @example
 * const { user } = useUser();
 *
 * @returns El objeto `UserContextType` que contiene los datos del usuario.
 * @throws {Error} Si se usa fuera de un `UserProvider`.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
