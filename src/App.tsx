import { Routes, Route } from "react-router-dom";
import { RegisterPage, NotFoundPage } from "pages";
import { Dashboard } from "pages/dashboard/Dashboard";
import { LogInPage } from "pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/login" element={<LogInPage />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
