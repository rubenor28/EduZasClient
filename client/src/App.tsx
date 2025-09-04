import { Routes, Route } from "react-router-dom";
import { RegisterPage, NotFoundPage } from "pages";
import { Form } from "pages/dashboard/Dashboard";
import { LogInPage } from "pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/sign-in" element={<LogInPage />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
