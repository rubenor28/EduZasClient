import { Routes, Route } from "react-router-dom";
import { Register, NotFoundPage } from "pages";

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<Register />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
