import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { isAdmin, isProfessorOrAdmin } from "@application";
import { authService } from "@dependencies";

import { type NavbarTab, Navbar } from "@components";

import {
  DashboardTabs,
  defaultTab,
  AssignedClasses,
  EnrolledClasses,
} from "@pages";

import "./Dashboard.css";
import type { UserDomain } from "@domain";

type DashboardState =
  | {
      state: "authenticated";
      user: UserDomain;
    }
  | {
      state: "unauthenticated";
    };

export function Dashboard() {
  const navigate = useNavigate();
  const { getUser, setInternalServerError, setForbid, setUnauthorized } =
    useAuthContext();

  const [pageState, setPageState] = useState<DashboardState>({
    state: "unauthenticated",
  });

  useEffect(() => {
    getUser().then((result) => {
      if (result.err && result.val === "unauthorized") {
        setUnauthorized();
        return;
      }

      if (result.err && result.val === "forbidden") {
        setForbid();
        return;
      }

      if (result.ok) {
        setPageState({
          state: "authenticated",
          user: result.val,
        });
        return;
      }

      setInternalServerError();
      throw Error;
    });
  }, []);

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  if (pageState.state === "unauthenticated") throw Error;

  const { user } = pageState;

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
        {currentTab === DashboardTabs.EnrolledClasses && <EnrolledClasses />}
        {currentTab === DashboardTabs.MyClasses && <AssignedClasses />}
      </main>
    </>
  );
}
