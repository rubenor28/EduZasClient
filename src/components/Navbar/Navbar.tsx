import { useState } from "react";
import { capitalize } from "services";
import type { NavbarTab } from "./navbar.types";
import type { User } from "entities/users/entities";

import "./Navbar.css";

/**
 * Propiedades del componente Navbar.
 * @template T - Tipo de las claves de las pestañas (debe ser string)
 */
type NavbarProps<T extends string> = {
  /** Información del usuario autenticado */
  user: User;
  /** Función para cerrar sesión */
  logout: () => void;
  /** Callback opcional que se ejecuta al cambiar de pestaña */
  onTabChange?: (tab: T) => void;
  /** Array de pestañas de navegación */
  tabs: NavbarTab<T>[];
  /** Pestaña activa inicial (opcional) */
  initialActiveTab?: T;
};

/**
 * Componente de barra de navegación responsive con soporte para pestañas,
 * usuario autenticado y menú móvil desplegable.
 *
 * @template T - Tipo de las claves de las pestañas (extiende string)
 *
 * @param props - Propiedades del componente
 * @returns Componente de barra de navegación
 *
 * @example
 * // Ejemplo básico de uso
 * <Navbar
 *   user={currentUser}
 *   logout={handleLogout}
 *   tabs={[
 *     { key: 'dashboard', label: 'Dashboard', visible: true },
 *     { key: 'profile', label: 'Perfil', visible: true }
 *   ]}
 *   onTabChange={(tab) => console.log('Tab changed:', tab)}
 *   initialActiveTab="dashboard"
 * />
 *
 * @example
 * // Ejemplo con tipos específicos para las pestañas
 * type AppTabs = 'home' | 'products' | 'contact';
 *
 * const tabs: NavbarTab<AppTabs>[] = [
 *   { key: 'home', label: 'Inicio' },
 *   { key: 'products', label: 'Productos' },
 *   { key: 'contact', label: 'Contacto' }
 * ];
 *
 * <Navbar<AppTabs>
 *   user={user}
 *   logout={logout}
 *   tabs={tabs}
 *   onTabChange={(tab) => handleNavigation(tab)}
 * />
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firstName = capitalize(user.firstName ?? "");
  const midName = capitalize(user.midName ?? "");
  const helloMessage = user.midName
    ? `¡Hola ${firstName} ${midName}!`
    : `¡Hola ${firstName}!`;

  /**
   * Maneja el cambio de pestaña y cierra el menú móvil si está abierto
   * @param key - Clave de la pestaña seleccionada
   */
  const handleOnTabChange = (key: T): void => {
    setActive(key);
    if (onTabChange) onTabChange(key);
    setIsMenuOpen(false);
  };

  const visibleTabs = tabs.filter((tab) => tab.visible !== false);

  return (
    <nav className="navbar">
      {/* Sección izquierda - Logo o espacio vacío */}
      <div className="navbar-section navbar-left" />

      {/* Sección central - Tabs (visible en desktop) */}
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

      {/* Sección derecha - Saludo y botón de logout */}
      <div className="navbar-section navbar-right">
        <p className="navbar-greeting">{helloMessage}</p>
        <button className="blue-button" onClick={logout} type="button">
          Cerrar sesión
        </button>
      </div>

      {/* Menú hamburguesa para móviles */}
      <div className="navbar-mobile-toggle">
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menú desplegable para móviles */}
      <div
        className={`navbar-mobile-menu ${isMenuOpen ? "navbar-mobile-menu--open" : ""}`}
      >
        <div className="mobile-menu-header">
          <p className="mobile-greeting">{helloMessage}</p>
          <button
            className="mobile-close-button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <div className="mobile-menu-tabs">
          {visibleTabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={String(tab.key)}
                type="button"
                className={`mobile-nav-tab ${isActive ? "mobile-nav-tab--active" : ""}`}
                onClick={() => handleOnTabChange(tab.key)}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mobile-menu-footer">
          <button className="mobile-logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div className="navbar-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </nav>
  );
}
