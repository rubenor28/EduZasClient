import { Routes, Route } from "react-router-dom";
import { RegisterPage, NotFoundPage } from "pages";
import { Form } from "pages/dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/sign-up" element={<RegisterPage />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
