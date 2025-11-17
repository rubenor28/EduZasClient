import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "../components/errors";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
