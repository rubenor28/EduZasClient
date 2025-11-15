import type { AppViewHook, AppViewStore } from "@application";
import { create } from "zustand";

/**
 * Hook y store de Zustand que implementa el contrato `AppViewStore`.
 *
 * Se encarga de gestionar el estado de la vista global de la aplicación. Su propósito es
 * controlar si se debe mostrar un estado de 'cargando', 'error' o 'inactivo'.
 */
export const useAppViewZustandStore: AppViewHook = create<AppViewStore>((set) => ({
  /**
   * El estado actual de la vista.
   * - `idle`: La aplicación está en estado de reposo.
   * - `loading`: La aplicación está realizando una operación.
   * - `error`: Se ha producido un error.
   */
  status: { type: "idle" },

  /**
   * Cambia el estado de la vista a 'error' con un código específico.
   * @param code El código de error a establecer.
   */
  setError: (code) => set({ status: { type: "error", code } }),

  /**
   * Cambia el estado de la vista a 'idle' (inactivo).
   */
  setIdle: () => set({ status: { type: "idle" } }),

  /**
   * Cambia el estado de la vista a 'loading' (cargando).
   */
  setLoading: () => set({ status: { type: "loading" } }),
}));

