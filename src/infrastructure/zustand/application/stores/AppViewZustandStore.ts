import type { AppViewHook, AppViewStore, AppViewStatus } from "@application";
import { create } from "zustand";

export const useAppViewZustandStore: AppViewHook = create<AppViewStore>((set) => ({
  status: "idle",
  setStatus: (newStatus: AppViewStatus) => set({ status: newStatus }),
}));
