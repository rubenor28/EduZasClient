import { authService } from "@dependencies";
import { LogInForm } from "./LogInForm";
import { AuthPage } from "../components/PageDecoration";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    authService.isAuth().then((validation) => {
      if (validation !== undefined) {
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
