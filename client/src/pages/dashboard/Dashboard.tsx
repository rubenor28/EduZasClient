import { Navbar } from "components/Navbar/Navbar";
import type { User } from "entities/users/entities";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/auth.service";

import "./Dashboard.css";

// Register.tsx
export function Form() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | undefined>(undefined);
  const userName = `${user?.firstName ?? ""} ${user?.midName ?? ""}`;

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
      <Navbar userName={userName} logout={handleLogout} />
    </>
  );
}
