import { Routes, Route } from "react-router-dom";
import { RegisterPage, Dashboard, LogInPage } from "@pages";
import { NotFoundPage } from "@components";

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
