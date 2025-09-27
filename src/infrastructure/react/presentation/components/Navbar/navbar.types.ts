import { mapStringToEnum } from "@application";

/**
 * Representa una pestaña dentro del {@link Navbar}.
 *
 * @template T - Unión literal de cadenas que identifica las pestañas disponibles.
 */
export interface NavbarTab<T extends string> {
  /** Identificador único de la pestaña (clave tipada). */
  key: T;
  /** Texto visible en la UI que representa la pestaña. */
  label: string;
  /**
   * Define si la pestaña debe mostrarse.
   * - `true` (por defecto): se muestra.
   * - `false`: se oculta.
   */
  visible?: boolean;
}

/**
 * Enumeración de pestañas disponibles en el Navbar.
 *
 * Se define como un objeto `as const` para generar un tipo de unión de cadenas.
 */
export const NavbarPage = {
  /** Clases inscritas */
  EnrolledClasses: "EnrolledClasses",
  /** Mis clases */
  MyClasses: "MyClasses",
  /** Recursos disponibles */
  Resources: "Resources",
  /** Evaluaciones */
  Tests: "Tests",
} as const;

/**
 * Tipo que representa todas las pestañas posibles del {@link NavbarPage}.
 *
 * Es una unión literal de las propiedades de `NavbarPage`.
 *
 * @example
 * ```ts
 * type Example = NavbarPage;
 * // "EnrolledClasses" | "MyClasses" | "Resources" | "Tests"
 * ```
 */
export type NavbarPage = (typeof NavbarPage)[keyof typeof NavbarPage];

/**
 * Mapea un string arbitrario a un valor válido de {@link NavbarPage}.
 *
 * @param key - Cadena a mapear.
 * @returns El valor correspondiente dentro de {@link NavbarPage}.
 * @throws {Error} Si el valor no existe en el enum.
 *
 * @example
 * ```ts
 * mapNavbarPage("Resources"); // ✅ "Resources"
 * mapNavbarPage("Unknown");   // ❌ Lanza Error
 * ```
 */
export function mapNavbarPage(key: string): NavbarPage {
  return mapStringToEnum(key, NavbarPage);
}
