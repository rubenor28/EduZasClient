import { createContext, useContext } from "react";

export type PopUpFormContextType = {
  open: boolean;
  setPopUpOpen: (open: boolean) => void;
};

export const PopUpFormContext = createContext<PopUpFormContextType | undefined>(
  undefined,
);

export function usePopUpFormContext() {
  const data = useContext(PopUpFormContext);

  if (data === undefined)
    throw Error("usePopUpFormContext debe ser usado con un PopUpFormContext");

  return data;
}
