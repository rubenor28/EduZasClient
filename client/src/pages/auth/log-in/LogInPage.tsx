import { LogInForm } from "./LogInForm";
import { AuthPage } from "../components/PageDecoration";
import { authService } from "services/auth.service";

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
