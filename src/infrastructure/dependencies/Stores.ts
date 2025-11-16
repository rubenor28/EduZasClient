import type { AppHook } from "@application";
import { useAppZustandStore } from "@infrastructure-zustand";

export const useAppStore: AppHook = useAppZustandStore;
