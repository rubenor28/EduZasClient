import { apiGet, apiPost, NotFoundError, type Resource } from "@application";
import { CircularProgress } from "@mui/material";
import { ResourcePreview, useUser } from "@presentation";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

type Params = {
  resourceId: string;
  classId: string;
};

type Page = { state: "loading" } | { state: "idle"; resource: Resource };

export function ResourcePreviewPage() {
  const { resourceId, classId } = useParams<Params>();
  const [page, setPage] = useState<Page>({ state: "loading" });
  const viewStartTime = useRef<Date | null>(null);
  const { user } = useUser();

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
    return <ResourcePreview resource={page.resource} />;
}
