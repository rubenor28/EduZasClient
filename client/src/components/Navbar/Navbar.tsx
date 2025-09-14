// Navbar.tsx
import { useState } from "react";
import { capitalize } from "services";
import type { NavbarTab } from "./navbar.types";
import type { User } from "entities/users/entities";

import "./Navbar.css";

type NavbarProps<T extends string> = {
  /** Usuario actual (se usa para saludo). */
  user: User;
  /** Callback que cierra sesión. */
  logout: () => void;
  /**
   * Callback que se ejecuta al cambiar de pestaña.
   * Recibe el valor fuertemente tipado del tab seleccionado.
   */
  onTabChange?: (tab: T) => void;
  /**
   * Lista de pestañas a mostrar.
   * Cada elemento debe cumplir la forma de {@link NavbarTab}<T>.
   */
  tabs: NavbarTab<T>[];
  /**
   * Pestaña inicial activa. Si no se provee se toma la primera de `tabs`.
   */
  initialActiveTab?: T;
};

/**
 * Componente de navegación principal.
 *
 * Renderiza una barra con:
 * - Zona izquierda (vacía por defecto).
 * - Zona central con pestañas clickables derivadas de `tabs`.
 * - Zona derecha con saludo al usuario y botón de logout.
 *
 * Características importantes:
 * - Genérico en `T extends string` para tipar fuertemente las claves de pestaña.
 * - La pestaña activa se infiere de `initialActiveTab` o `tabs[0].key`.
 * - Solo muestra pestañas con `visible !== false`.
 * - A11y: `role="tablist"` en el contenedor y `role="tab"` en cada botón.
 *
 * @template T - Unión literal de strings que representa las claves de pestaña.
 * @param props.user - Usuario actual.
 * @param props.logout - Función para cerrar sesión.
 * @param props.onTabChange - Callback ejecutado cuando cambia la pestaña.
 * @param props.tabs - Array de pestañas tipo {@link NavbarTab}<T>.
 * @param props.initialActiveTab - Pestaña activa inicial (opcional).
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * // Ejemplo mínimo de NavbarTab expected shape:
 * // type NavbarTab<T extends string> = { key: T; label: string; visible?: boolean };
 *
 * const tabs = [
 *   { key: "MyClasses", label: "Mis clases" },
 *   { key: "EnrolledClasses", label: "Clases inscritas" },
 * ] as const;
 *
 * <Navbar
 *   user={user}
 *   logout={() => {}}
 *   tabs={tabs}
 *   initialActiveTab={tabs[0].key}
 *   onTabChange={(tab) => console.log("cambio a", tab)}
 * />
 * ```
 */
export function Navbar<T extends string>({
  user,
  logout,
  onTabChange,
  tabs,
  initialActiveTab,
}: NavbarProps<T>) {
  const [active, setActive] = useState<T>(
    initialActiveTab || (tabs[0]?.key as T),
  );

  const firstName = capitalize(user.firstName ?? "");
  const midName = capitalize(user.midName ?? "");
  const helloMessage = user.midName
    ? `¡Hola ${firstName} ${midName}!`
    : `¡Hola ${firstName}!`;

  const handleOnTabChange = (key: T): void => {
    setActive(key);
    if (onTabChange) onTabChange(key);
  };

  // Filtrar pestañas visibles (por defecto todas son visibles)
  const visibleTabs = tabs.filter((tab) => tab.visible !== false);

  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left" />

      <div className="navbar-section navbar-center">
        <div
          className="navbar-center-tabs"
          role="tablist"
          aria-label="Navegación principal"
        >
          {visibleTabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={String(tab.key)}
                type="button"
                className={`nav-tab ${isActive ? "nav-tab--active" : ""}`}
                onClick={() => handleOnTabChange(tab.key)}
                aria-current={isActive ? "page" : undefined}
                role="tab"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="navbar-section navbar-right">
        <p className="navbar-greeting">{helloMessage}</p>
        <button className="blue-button" onClick={logout} type="button">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
