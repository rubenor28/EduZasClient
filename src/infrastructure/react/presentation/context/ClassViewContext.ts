import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO } from "@application";
import { createContext, useContext } from "react";

export type ClassViewContext = {
  criteria: ClassCriteriaDTO;
  classes: ClassDomain[];
  setCriteria: (criteria: ClassCriteriaDTO) => void;
  setClasses: (classes: ClassDomain[]) => void;
  refreshClasses: (criteria: ClassCriteriaDTO) => void;
};

// Context sin garantizar no undefined, siempre debe tener un valor default
// o sin evitar que un dev olvide el Wrapper del Provider y de errores
export const ClassViewContext = createContext<ClassViewContext | undefined>(
  undefined,
);

// Hook para asegurarnos que ClassViewData ya fue inicializado y eliminar el undefined
export function useClassViewContext() {
  const classViewData = useContext(ClassViewContext);

  if (classViewData === undefined) {
    throw Error("useClassViewContext debe ser usada con un ClassViewContext");
  }

  return classViewData;
}
