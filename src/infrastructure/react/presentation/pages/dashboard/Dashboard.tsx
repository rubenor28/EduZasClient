import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { isAdmin, isProfessorOrAdmin } from "@application";
import { authService } from "@dependencies";
import { type NavbarTab, Navbar } from "@components";

import { DashboardTabs } from "./dashboard.types";
import { EnrolledClasses } from "./tabs/EnrolledClasses";
import { ProtectedRoute } from "../auth";
import "./Dashboard.css";

export function Dashboard() {
  const [currentTab, setCurrentTab] =
    useState<DashboardTabs>("EnrolledClasses");
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  return (
    <ProtectedRoute>
      {(user) => {
        console.log(`IsAdmin ${isAdmin(user)}`);
        console.log(`IsProfesorOrDamin ${isProfessorOrAdmin(user)}`);

        const tabs: NavbarTab<DashboardTabs>[] = [
          {
            key: DashboardTabs.SystemClasses,
            label: "Clases registradas",
            visible: isAdmin(user),
          },
          {
            key: DashboardTabs.MyClasses,
            label: "Clases asesoradas",
            visible: isProfessorOrAdmin(user),
          },
          {
            key: DashboardTabs.Resources,
            label: "Recursos académicos",
            visible: isProfessorOrAdmin(user),
          },
          {
            key: DashboardTabs.Tests,
            label: "Evaluaciones",
            visible: isProfessorOrAdmin(user),
          },
          { key: DashboardTabs.EnrolledClasses, label: "Clases Inscritas" },
        ];

        return (
          <>
            <Navbar<DashboardTabs>
              onTabChange={(tab) => setCurrentTab(tab)}
              initialActiveTab="EnrolledClasses"
              tabs={tabs}
              user={user}
              logout={handleLogout}
            />

            <main className="main-content">
              {currentTab === DashboardTabs.EnrolledClasses && (
                <EnrolledClasses />
              )}
            </main>
          </>
        );
      }}
    </ProtectedRoute>
  );
}
