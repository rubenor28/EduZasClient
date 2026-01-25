import { apiGet, NotFoundError, type Resource } from "@application";
import { CircularProgress } from "@mui/material";
import { ResourcePreview } from "@presentation";
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

  useEffect(() => {
    if (!resourceId || !classId) throw new NotFoundError();

    const fetchResource = async () => {
      const resource = await apiGet<Resource>(
        `/resources/${resourceId}/${classId}/`
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
          startTimeUTC: viewStartTime.current.toISOString(),
          endTimeUTC: new Date().toISOString(),
        };

        navigator.sendBeacon(
          `/api/telemetry/${resourceId}`,
          JSON.stringify(payload)
        );

        viewStartTime.current = null;
      }
    };

    window.addEventListener("beforeunload", sendTelemetry);

    return () => {
      sendTelemetry();
      window.removeEventListener("beforeunload", sendTelemetry);
    };
  }, [resourceId, classId]);

  if (page.state === "loading") return <CircularProgress />;

  if (page.state === "idle")
    return <ResourcePreview resource={page.resource} />;
}
