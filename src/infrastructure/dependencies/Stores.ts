import type { AppViewHook, AuthHook } from "@application";
import {
  useAppViewZustandStore,
  useAuthZustandStore,
} from "@infrastructure-zustand";

export const useAppViewStore: AppViewHook = useAppViewZustandStore;
export const useAuthStore: AuthHook = useAuthZustandStore;
