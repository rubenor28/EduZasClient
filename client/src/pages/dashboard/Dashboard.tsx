import "./Dashboard.css";
import { appState } from "state/app.state";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Register.tsx
export function Form() {
  const navigate = useNavigate();
  const { auth } = appState();

  useEffect(() => {
    if (!auth.isAuth) {
      navigate("/login");
      return;
    }
  }, []);

  return <h1>Hello world</h1>;
}
