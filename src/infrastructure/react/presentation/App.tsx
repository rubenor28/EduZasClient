import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage, Dashboard, LogInPage } from "@pages";
import { NotFoundPage, ProtectedRoute } from "@components";
import { AppViewManager } from "./layouts";

function App() {
  return (
    <AppViewManager>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/login" element={<LogInPage />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </AppViewManager>
  );
}

export default App;
