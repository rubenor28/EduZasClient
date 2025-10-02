import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { isAdmin, isProfessorOrAdmin } from "@application";
import { authService } from "@dependencies";
import {
  type NavbarTab,
  Navbar,
  type ProtectedElementProps,
} from "@components";

import { DashboardTabs, defaultTab } from "./dashboard.types";
import { EnrolledClasses, AssignedClasses } from "./tabs";

import "./Dashboard.css";

type DashboardProps = ProtectedElementProps & {};

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  const initialTab = defaultTab(user.role);
  const [currentTab, setCurrentTab] = useState<DashboardTabs>(initialTab);

  const tabs: NavbarTab<DashboardTabs>[] = [
    {
      key: DashboardTabs.SystemClasses,
      label: "Clases registradas",
      visible: isAdmin(user.role),
    },
    {
      key: DashboardTabs.MyClasses,
      label: "Clases asesoradas",
      visible: isProfessorOrAdmin(user.role),
    },
    {
      key: DashboardTabs.Resources,
      label: "Recursos académicos",
      visible: isProfessorOrAdmin(user.role),
    },
    {
      key: DashboardTabs.Tests,
      label: "Evaluaciones",
      visible: isProfessorOrAdmin(user.role),
    },
    { key: DashboardTabs.EnrolledClasses, label: "Clases Inscritas" },
  ];

  return (
    <>
      <Navbar<DashboardTabs>
        onTabChange={(tab) => setCurrentTab(tab)}
        initialActiveTab={currentTab}
        tabs={tabs}
        user={user}
        logout={handleLogout}
      />

      <main className="main-content">
        {currentTab === DashboardTabs.EnrolledClasses && (
          <EnrolledClasses userId={user.id} />
        )}
        {currentTab === DashboardTabs.MyClasses && <AssignedClasses />}
      </main>
    </>
  );
}
