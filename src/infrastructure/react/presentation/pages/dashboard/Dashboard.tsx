import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { isAdmin, isProfessorOrAdmin } from "@application";
import { authService } from "@dependencies";

import {
  type NavbarTab,
  Navbar,
  type ProtectedElementProps,
} from "@components";

import { DashboardTabs, defaultTab, AssignedClasses, EnrolledClasses } from "@pages";

import "./Dashboard.css";

// WARNING: Se usa partial para evitar errores de paso directo
// de user al usar <ProtectedRoute>children<ProtectedRoute> pues
// Protected route inyecta el user
type DashboardProps = Partial<ProtectedElementProps> & {};

export function Dashboard({ user }: DashboardProps) {
  // WARNING: Asumimos que no hay caso de user undefined, no supe
  // arreglar esto jaja
  const usr = user!;
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  const initialTab = defaultTab(usr.role);
  const [currentTab, setCurrentTab] = useState<DashboardTabs>(initialTab);

  const tabs: NavbarTab<DashboardTabs>[] = [
    {
      key: DashboardTabs.SystemClasses,
      label: "Clases registradas",
      visible: isAdmin(usr.role),
    },
    {
      key: DashboardTabs.MyClasses,
      label: "Clases asesoradas",
      visible: isProfessorOrAdmin(usr.role),
    },
    {
      key: DashboardTabs.Resources,
      label: "Recursos académicos",
      visible: isProfessorOrAdmin(usr.role),
    },
    {
      key: DashboardTabs.Tests,
      label: "Evaluaciones",
      visible: isProfessorOrAdmin(usr.role),
    },
    { key: DashboardTabs.EnrolledClasses, label: "Clases Inscritas" },
  ];

  return (
    <>
      <Navbar<DashboardTabs>
        onTabChange={(tab) => setCurrentTab(tab)}
        initialActiveTab={currentTab}
        tabs={tabs}
        user={usr}
        logout={handleLogout}
      />

      <main className="main-content">
        {currentTab === DashboardTabs.EnrolledClasses && <EnrolledClasses />}
        {currentTab === DashboardTabs.MyClasses && <AssignedClasses />}
      </main>
    </>
  );
}
