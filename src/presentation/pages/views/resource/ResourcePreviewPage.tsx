import { apiGet, NotFoundError, type Resource } from "@application";
import { CircularProgress } from "@mui/material";
import { ResourcePreview } from "@presentation";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type Params = {
  resourceId: string;
  classId: string;
};

type Page = { state: "loading" } | { state: "idle"; resource: Resource };

export function ResourcePreviewPage() {
  const { resourceId, classId } = useParams<Params>();
  const [page, setPage] = useState<Page>({ state: "loading" });

  useEffect(() => {
    if (!resourceId || !classId) throw new NotFoundError();

    const fetchResource = async () => {
      var resource = await apiGet<Resource>(
        `/resources/${resourceId}/${classId}/`,
      );
      setPage({
        state: "idle",
        resource,
      });
    };

    fetchResource();
  }, [resourceId, classId]);

  if (page.state === "loading") return <CircularProgress />;

  if (page.state === "idle")
    return <ResourcePreview resource={page.resource} />;
}
