import { authService, useAppViewStore, useAuthStore } from "@dependencies";
import { LoadingPage } from "@components";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteState = "loading" | "ok";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [pageState, setPageState] = useState<ProtectedRouteState>("loading");
  const appViewStore = useAppViewStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const loginValidation = async () => {
    try {
      let req = await authService.isAuth();
      if (req.err) {
        if (req.val.type !== "unauthorized") {
          appViewStore.setStatus("interal_server_error");
          throw Error("Unexpected error while checking auth");
        }

        console.warn("Unauthorized");
        navigate("/login");
        return;
      }

      // Update auth store state
      authStore.setStatus({ type: "user", data: req.val });
      setPageState("ok");
    } catch (_) {
      appViewStore.setStatus("interal_server_error");
      throw Error("Unexpected error while checking auth");
    }
  };

  useEffect(() => {
    loginValidation();
  }, []);

  return <>{pageState === "ok" ? children : <LoadingPage />}</>;
}
