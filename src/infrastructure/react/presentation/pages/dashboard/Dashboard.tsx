import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserType, type UserDomain } from "@domain";
import { authService } from "@dependencies";
import { type NavbarTab, Navbar } from "@components";
import { DashboardTabs } from "./dashboard.types";
import { EnrolledClasses } from "./tabs/EnrolledClasses";
import "./Dashboard.css";

// Register.tsx
export function Dashboard() {
  const [currentTab, setCurrentTab] =
    useState<DashboardTabs>("EnrolledClasses");
  const navigate = useNavigate();

  const tabs: NavbarTab<DashboardTabs>[] = [
    { key: DashboardTabs.EnrolledClasses, label: "Clases Inscritas" },
    { key: DashboardTabs.MyClasses, label: "Mis Clases" },
    { key: DashboardTabs.Resources, label: "Recursos" },
    { key: DashboardTabs.Tests, label: "Pruebas" },
  ];

  const [user, setUser] = useState<UserDomain>({
    id: 0,
    email: "",
    fatherLastName: "",
    firstName: "",
    role: UserType.STUDENT,
  });

  const handleLogout = () => {
    authService.logout().then(() => navigate("/login"));
  };

  useEffect(() => {
    authService.isAuth().then((validation) => {
      console.log(validation);
      if (validation === undefined) {
        // navigate("/login");
        console.error("No autenticado");
        return;
      }

      setUser(validation);
    });
  }, []);

  return (
    <>
      <Navbar<DashboardTabs>
        onTabChange={(tab) => setCurrentTab(tab)}
        initialActiveTab="EnrolledClasses"
        tabs={tabs}
        user={user as UserDomain}
        logout={handleLogout}
      />

      <main className="main-content">
        {currentTab === DashboardTabs.EnrolledClasses && <EnrolledClasses />}
      </main>
    </>
  );
}
