// navbar.types.ts

import { mapStringToEnum } from "services";

// Eliminamos el enum específico y creamos una interfaz genérica
export interface NavbarTab<T extends string> {
  key: T;
  label: string;
  visible?: boolean;
}

export const NavbarPage = {
  EnrolledClasses: "EnrolledClasses",
  MyClasses: "MyClasses",
  Resources: "Resources",
  Tests: "Tests",
} as const;

export type NavbarPage = (typeof NavbarPage)[keyof typeof NavbarPage];

export function mapNavbarPage(key: string): NavbarPage {
  return mapStringToEnum(key, NavbarPage);
}
