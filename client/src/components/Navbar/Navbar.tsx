// Navbar.tsx
import { useState } from "react";
import { capitalize } from "services";
import type { User } from "entities/users/entities";
import { type NavbarTab } from "./navbar.types";

import "./Navbar.css";

type NavbarProps<T extends string> = {
  user: User;
  logout: () => void;
  onTabChange: (tab: T) => void;
  tabs: NavbarTab<T>[];
  initialActiveTab?: T;
};

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
    onTabChange(key);
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
