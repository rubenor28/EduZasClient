import { type APIErrorDTO } from "@application";
import { useAppViewStore } from "@dependencies";
import { useNavigate } from "react-router-dom";

export function handleApiErrorViewHelper(error: APIErrorDTO): void {
  const appViewStore = useAppViewStore();
  const navigate = useNavigate();

  switch (error.type) {
    case "unauthorized":
      navigate("/login");
      break;
    case "forbid":
      appViewStore.setStatus("forbid");
      break;
    case "not-found":
      appViewStore.setStatus("not_found");
      break;
    case "internal-server-error":
      appViewStore.setStatus("interal_server_error");
      break;
    case "already-exists":
    case "input-error":
      appViewStore.setStatus("interal_server_error");
      throw Error("Unable to handle error");
  }
}
