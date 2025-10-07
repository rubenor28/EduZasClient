import type { ClassUpdateDTO, NewClassDTO } from "@application";
import { createContext, useContext } from "react";

export type ClassFormInput =
  | {
      mode: "create";
      data: NewClassDTO;
    }
  | {
      mode: "modify";
      data: ClassUpdateDTO;
    };

export type ClassPopUpFormData = {
  open: boolean;
  input: ClassFormInput;
};

export interface ClassPopUpFormContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  input: ClassFormInput;
  setInput: (input: ClassFormInput) => void;
}

export const ClassPopUpFormContext = createContext<
  ClassPopUpFormContextType | undefined
>(undefined);

export function useClassPopUpFormContext() {
  const data = useContext(ClassPopUpFormContext);

  if (data === undefined) {
    throw Error(
      "useClassPopUpFormContext debe ser usado con un ClassPopUpFormContext",
    );
  }

  return data;
}
