import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  type AppError,
} from "@application";
import { Navigate } from "react-router-dom";
import { Forbidden } from "./Forbidden";
import { InternalServerError as InternalServer } from "./InternalServerError";
import { NotFound } from "./NotFound";

interface Props {
  error: AppError | null;
  onClear?: () => void;
}

/**
 * Componente presentacional que renderiza una vista de error apropiada
 * basada en el tipo de error proporcionado.
 * @param error El objeto de error de la aplicación.
 * @param onClear Una función opcional para limpiar el estado de error.
 */
export function ErrorView({ error, onClear }: Props) {
  if (error instanceof UnauthorizedError) {
    if (onClear) onClear();
    return <Navigate to="/login" />;
  }
  if (error instanceof ForbiddenError) {
    return <Forbidden onClear={onClear} />;
  }
  if (error instanceof NotFoundError) {
    return <NotFound />;
  }

  // Por defecto, o si el error es InternalServerError
  return <InternalServer onClear={onClear} />;
}
