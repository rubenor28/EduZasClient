import { Routes, Route } from "react-router-dom";
import { Register } from "pages/auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />

      {/* CATCH-ALL: si no coincide ninguna, muestra 404 */}
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
