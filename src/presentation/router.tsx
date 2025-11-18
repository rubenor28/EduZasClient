import { createBrowserRouter } from "react-router-dom";
import { Login, Register, Home } from "./pages";
import { GlobalErrorDisplay, NotFound } from "./components/errors";
import { AuthErrorAs500Boundary } from "./components/errors";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalErrorDisplay>
        <Home />
      </GlobalErrorDisplay>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthErrorAs500Boundary>
        <Login />
      </AuthErrorAs500Boundary>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthErrorAs500Boundary>
        <Register />
      </AuthErrorAs500Boundary>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
