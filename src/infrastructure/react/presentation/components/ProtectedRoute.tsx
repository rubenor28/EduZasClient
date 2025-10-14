import type { AuthErrors, Result, UserDomain } from "@domain";

import { authService } from "@dependencies";
import {
  LoadingPage,
  ForbiddenPage,
  ServerErrorPage,
  NotFoundPage,
} from "@components";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@context";

export type AuthPageError = "forbid" | "not_found" | "server_error";

export type PageStates = "loading" | "ok" | AuthPageError;

export type ProtectedElementProps = {
  user: UserDomain;
};

type ProtectedRouteProps = {
  children: React.ReactElement<ProtectedElementProps>;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [pageState, setPageState] = useState<PageStates>("loading");
  const navigate = useNavigate();

  const getUser = async (): Promise<Result<UserDomain, AuthErrors>> => {
    try {
      return await authService.isAuth();
    } catch (_) {
      setPageState("server_error");
      throw Error;
    }
  };

  const loginValidation = () => {
    getUser().then((result) => {
      if (result.err && result.val === "unauthorized") {
        navigate("/login");
        return;
      }

      if (result.ok) {
        setPageState("ok");
      }
    });
  };

  useEffect(() => {
    loginValidation();
  }, []);

  const viewPerState: Record<PageStates, React.ReactNode> = {
    ok: children,
    loading: <LoadingPage />,
    not_found: <NotFoundPage />,
    forbid: <ForbiddenPage />,
    server_error: <ServerErrorPage />,
  };

  return (
    <AuthContext.Provider
      value={{
        getUser,
        setInternalServerError: () => setPageState("server_error"),
        setForbid: () => setPageState("forbid"),
        onUnauthorized: () => console.log()
      }}
    >
      {viewPerState[pageState] ?? viewPerState["server_error"]}
    </AuthContext.Provider>
  );
}
