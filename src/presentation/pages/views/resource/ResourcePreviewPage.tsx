import { apiGet, apiPost, NotFoundError, type Resource } from "@application";
import { Box, Button, CircularProgress } from "@mui/material";
import { ResourcePreview, useUser } from "@presentation";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";

/**
 * Parámetros de ruta para la previsualización de recursos.
 */
type Params = {
  /** ID del recurso a visualizar. */
  resourceId: string;
  /** ID de la clase desde la cual se accede al recurso. */
  classId: string;
};

/**
 * Estado interno de la página de previsualización.
 */
type Page = { state: "loading" } | { state: "idle"; resource: Resource };

/**
 * Página para la previsualización de recursos académicos.
 * 
 * Responsabilidades:
 * 1. Cargar y mostrar el contenido del recurso mediante `ResourcePreview`.
 * 2. Registrar el tiempo de inicio de la visualización.
 * 3. Enviar telemetría (tiempo de lectura) al cerrar la página o navegar fuera.
 * 4. Permitir a los profesores acceder al reporte de uso del recurso.
 */
export function ResourcePreviewPage() {
  const { resourceId, classId } = useParams<Params>();
  const [page, setPage] = useState<Page>({ state: "loading" });
  const viewStartTime = useRef<Date | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resourceId || !classId) throw new NotFoundError();

    const fetchResource = async () => {
      const resource = await apiGet<Resource>(
        `/resources/${resourceId}/${classId}/`,
      );
      setPage({
        state: "idle",
        resource,
      });
      viewStartTime.current = new Date();
    };

    fetchResource();

    const sendTelemetry = () => {
      if (viewStartTime.current) {
        const payload = {
          userId: user.id,
          classId,
          resourceId,
          startTimeUTC: viewStartTime.current.toISOString(),
          endTimeUTC: new Date().toISOString(),
        };

        apiPost("/reports/resource/session", payload, {
          keepalive: true,
          parseResponse: "void",
        });

        viewStartTime.current = null;
      }
    };

    // Listener para cierre de pestaña/navegador
    window.addEventListener("beforeunload", sendTelemetry);

    // Cleanup para navegación interna (React Router)
    return () => {
      sendTelemetry();
      window.removeEventListener("beforeunload", sendTelemetry);
    };
  }, [resourceId, classId]);

  if (page.state === "loading") return <CircularProgress />;

  if (page.state === "idle")
    return (
      <>
        {user.role >= 1 && (
          <Box
            sx={{
              position: "sticky",
              gap: 2,
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
              p: 2,
              boxShadow: 1,
            }}
          >
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              onClick={() =>
                navigate(
                  `/professor/classes/resource/report/${classId}/${resourceId}`,
                )
              }
            >
              Reporte de uso
            </Button>
          </Box>
        )}
        <ResourcePreview resource={page.resource} />
      </>
    );
}
