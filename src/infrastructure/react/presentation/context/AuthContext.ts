import type { AuthErrors, Result, UserDomain } from "@domain";
import { createContext, useContext } from "react";

/**
 * Define la forma del contexto de autenticación.
 * Este contexto proporciona funciones para gestionar y consultar el estado de autenticación del usuario.
 */
export type AuthContextType = {
  /**
   * Recupera los datos del usuario actual.
   * @returns Un objeto Result que contiene el objeto de dominio del usuario o un error de autenticación.
   */
  getUser: () => Promise<Result<UserDomain, AuthErrors>>;

  /**
   * Establece el estado de autenticación como 'Forbidden' (Prohibido).
   * Se utiliza normalmente cuando un usuario está autenticado pero no tiene permiso para acceder a un recurso.
   */
  setForbid: () => void;

  /**
   * Establece el estado de autenticación como 'Internal Server Error' (Error interno del servidor).
   * Se utiliza para manejar errores inesperados del lado del servidor relacionados con la autenticación.
   */
  setInternalServerError: () => void;

  /**
   * Una función de callback que se ejecuta cuando ocurre un estado 'Unauthorized'.
   * Se puede utilizar para activar efectos secundarios, como redirigir al usuario a la página de inicio de sesión.
   */
  onUnauthorized: () => void;
};

/**
 * Contexto de React para gestionar el estado de autenticación en toda la aplicación.
 * Proporciona acceso al objeto `AuthContextType`.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Asegura que el hook se utilice dentro de un árbol de componentes envuelto por un `AuthProvider`.
 *
 * @throws Lanza un error si se utiliza fuera de un `AuthContext.Provider`.
 * @returns El objeto del contexto de autenticación.
 */
export function useAuthContext() {
  const authContext = useContext(AuthContext);

  if (authContext === undefined)
    throw Error("useAuthContext debe ser usado dentro de un AuthContext");

  return authContext;
}
