import { authService } from "@dependencies";
import { LogInForm } from "./LogInForm";
import { AuthPage } from "../components/AuthPage";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    authService.isAuth().then((validation) => {
      if (validation.ok) {
        navigate("/");
      }
    });
  }, []);

  return (
    <AuthPage>
      <LogInForm />
    </AuthPage>
  );
}
