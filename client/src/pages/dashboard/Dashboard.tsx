import "./Dashboard.css";

import { UserType } from "entities/users/enums";
import type { User } from "entities/users/entities";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/auth.service";

import { type NavbarTab, Navbar } from "components";
import { DashboardTabs } from "./dashboard.types";

// Register.tsx
export function Dashboard() {
  const [_, setCurrentTab] = useState<DashboardTabs>("EnrolledClasses");
  const navigate = useNavigate();

  const tabs: NavbarTab<DashboardTabs>[] = [
    { key: DashboardTabs.EnrolledClasses, label: "Clases Inscritas" },
    { key: DashboardTabs.MyClasses, label: "Mis Clases" },
    { key: DashboardTabs.Resources, label: "Recursos" },
    { key: DashboardTabs.Tests, label: "Pruebas" },
  ];

  const [user, setUser] = useState<User>({
    id: 0,
    email: "",
    fatherLastname: "",
    firstName: "",
    tuition: "",
    role: UserType.STUDENT,
  });

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  useEffect(() => {
    authService.isAuth().then((validation) => {
      if (validation.err) {
        navigate("/login");
        return;
      }

      setUser(validation.val);
    });
  }, []);

  return (
    <>
      <Navbar<DashboardTabs>
        onTabChange={(tab) => setCurrentTab(tab)}
        initialActiveTab="EnrolledClasses"
        tabs={tabs}
        user={user as User}
        logout={handleLogout}
      />
    </>
  );
}
