import { create } from "zustand";
import type { User } from "entities/users/entities";

/**
 * Estado de autenticación del usuario.
 *
 * - `isAuth: false` → No hay usuario autenticado.
 * - `isAuth: true; user` → Usuario autenticado con los datos correspondientes.
 */
type Auth = 
  | { isAuth: false } 
  | { isAuth: true; user: User };

/**
 * Estado global de la aplicación.
 */
interface AppState {
  /** Estado de autenticación actual. */
  auth: Auth;

  /**
   * Marca a un usuario como autenticado.
   *
   * @param user - Datos del usuario a autenticar.
   */
  login: (user: User) => void;

  /**
   * Marca el estado como no autenticado.
   * Elimina cualquier información de usuario almacenada.
   */
  logout: () => void;
}

/**
 * Store global de la aplicación usando `zustand`.
 * ```
 */
export const appState = create<AppState>((set) => ({
  auth: { isAuth: false },

  login: (user) => set(() => ({ auth: { isAuth: true, user } })),
  logout: () => set(() => ({ auth: { isAuth: false } })),
}));
