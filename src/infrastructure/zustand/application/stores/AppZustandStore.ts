import type { AppHook, AppViewStore } from "@application";
import { create } from "zustand";

export const useAppZustandStore: AppHook = create<AppViewStore>((set) => ({
  status: "idle",
  setStatus: (state) => set(state),
}));
