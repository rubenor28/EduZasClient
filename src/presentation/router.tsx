import { createBrowserRouter } from "react-router-dom";
import { Home, Layout } from "./pages";
import { GlobalErrorDisplay, NotFound } from "@presentation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalErrorDisplay>
        <Layout />
      </GlobalErrorDisplay>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
