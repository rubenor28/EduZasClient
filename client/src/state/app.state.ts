import { create } from "zustand";
import type { User } from "entities/users/entities";

/**
 * Estado global de la aplicación.
 */
interface AppState {
  isAuth: () => User | undefined;
  logout: () => void;
}

/**
 * Store global de la aplicación usando `zustand`.
 * ```
 */
export const appState = create<AppState>((set) => ({
  auth: { isAuth: false },

  logout: async () => {
    try {
      await fetch("/auth/logout", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  },
}));
