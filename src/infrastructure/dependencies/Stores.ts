import type { AppViewHook } from "@application";
import { useAppViewZustandStore } from "@infrastructure-zustand";

export const useAppViewStore: AppViewHook = useAppViewZustandStore;
