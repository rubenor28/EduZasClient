import type { AuthStore, AuthStatus } from "@application";
import type { UserDomain } from "@domain";
import { createStore } from "zustand";

/**
 * Interfaz interna que extiende la abstracción de la capa de aplicación
 * para incluir el estado y las acciones concretas de esta implementación.
 */
export interface UserAuthStore extends AuthStore {
  user: UserDomain | null;
  login: (user: UserDomain) => void;
  logout: () => void;
}

/**
 * Implementación singleton del store de autenticación usando Zustand.
 *
 * Se crea a nivel de módulo para que pueda ser importado y utilizado
 * por diferentes partes de la capa de infraestructura (React, Fetch, etc.)
 * de manera desacoplada.
 */
export const authStore = createStore<UserAuthStore>((set) => ({
  // Estado inicial
  status: { type: "guest" },
  user: null,

  // Implementación de la interfaz de la capa de aplicación
  setStatus: (status: AuthStatus) => set({ status }),

  // Acciones concretas de esta implementación
  login: (user: UserDomain) =>
    set({ user, status: { type: "user", data: user } }),

  logout: () => set({ user: null, status: { type: "guest" } }),
}));