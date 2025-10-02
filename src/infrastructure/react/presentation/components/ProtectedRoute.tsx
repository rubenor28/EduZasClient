import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { UserDomain } from "@domain";
import { authService } from "@dependencies";
import { LoadingPage, ForbiddenPage, ServerErrorPage } from "@components";

const PageStates = {
  LOADING: "loading",
  OK: "ok",
  FORBID: "forbid",
  ERROR: "error",
} as const;

type PageStates = (typeof PageStates)[keyof typeof PageStates];


export type ProtectedElementProps = {
  user: UserDomain;
};

type ProtectedRouteProps = {
  children: React.ReactElement<ProtectedElementProps>;
};


export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [pageState, setPageState] = useState<PageStates>(PageStates.LOADING);
  const [user, setUser] = useState<UserDomain | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    authService
      .isAuth()
      .then((result) => {
        if (result.err) {
          switch (result.val) {
            case "unauthorized":
              navigate("/login");
              break;
            case "forbidden":
              setPageState(PageStates.FORBID);
              break;
            default:
              setPageState(PageStates.ERROR);
              console.error("Internal server error");
          }
        } else {
          setUser(result.val);
          setPageState("ok");
        }
      })
      .catch(() => {
        setPageState(PageStates.ERROR);
        console.error("Internal server error");
      });
  }, []);

  switch (pageState) {
    case PageStates.LOADING:
      return <LoadingPage />;

    case PageStates.OK:
      return React.cloneElement(children, { user });

    case PageStates.FORBID:
      return <ForbiddenPage />;

    case PageStates.ERROR:
      return <ServerErrorPage />;

    default:
      return <ServerErrorPage />;
  }
}
