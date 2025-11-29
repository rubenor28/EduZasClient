import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type ResourceUpdate,
  apiDelete,
  apiPost,
  apiPut,
  ForbiddenError,
  type ResourceCriteria,
  type ResourceSummary,
  type NewResource,
  type Resource,
  apiGet,
} from "@application";
import {
  ResourceCard,
  ResourceSearchForm,
  useUser,
  usePaginatedSearch,
  type MenuOption,
  PaginationControls,
} from "@presentation";

export const ContenidoAcademico = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
    refreshSearch: refetch,
    firstPage,
    lastPage,
  } = usePaginatedSearch<ResourceSummary, ResourceCriteria>(
    "/resources/search",
    {
      page: 1,
      active: true,
      professorId: user.id,
    },
  );

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const payload: NewResource = {
        title: "Nueva nota",
        content: JSON.stringify([{ type: "paragraph", content: "" }]),
        professorId: user.id,
      };
      const newResource = await apiPost<ResourceSummary>("/resources", payload);
      navigate(`/professor/content/${newResource.id}`);
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Error al crear el nuevo contenido.",
        severity: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (resourceId: string) => {
    navigate(`/professor/content/${resourceId}`);
  };

  const handleArchive = async (resourceData: ResourceSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres archivar el contenido '${resourceData.title}'?`,
      )
    )
      return;
    try {
      const fullResource = await apiGet<Resource>(
        `/resources/${resourceData.id}`,
      );
      const payload: ResourceUpdate = { ...fullResource, active: false };
      await apiPut("/resources", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "El contenido ha sido archivado.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para archivar este contenido."
          : "Error al archivar el contenido.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleUnarchive = async (resourceData: ResourceSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres desarchivar el contenido '${resourceData.title}'?`,
      )
    )
      return;
    try {
      const fullResource = await apiGet<Resource>(
        `/resources/${resourceData.id}`,
      );
      const payload: ResourceUpdate = { ...fullResource, active: true };
      await apiPut("/resources", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "El contenido ha sido desarchivado.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para desarchivar este contenido."
          : "Error al desarchivar el contenido.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este contenido?")
    )
      return;
    try {
      await apiDelete(`/resources/${resourceId}`, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "El contenido ha sido eliminado.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para eliminar este contenido."
          : "Error al eliminar el contenido.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error)
      return (
        <Alert severity="error">Error al cargar el contenido académico.</Alert>
      );
    if (!data || data.results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>
          No se encontró contenido académico.
        </Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((resourceData) => {
          const menuOptions: MenuOption[] = [];

          if (resourceData.active) {
            menuOptions.push({
              name: "Archivar",
              callback: () => handleArchive(resourceData),
            });
          } else {
            menuOptions.push({
              name: "Desarchivar",
              callback: () => handleUnarchive(resourceData),
            });
          }

          menuOptions.push({
            name: "Eliminar",
            callback: () => handleDelete(resourceData.id),
          });

          return (
            <Grid item key={resourceData.id} xs={12} sm={6} md={4} lg={3}>
              <ResourceCard
                resourceData={resourceData}
                onClick={() => handleEdit(resourceData.id)}
                isLoading={isLoading}
                menuOptions={menuOptions}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: "transparent", boxShadow: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contenido Académico
        </Typography>
        <Button
          variant="contained"
          startIcon={isCreating ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleCreate}
          disabled={isCreating}
        >
          Nuevo Contenido
        </Button>
      </Box>

      <ResourceSearchForm criteria={criteria} setCriteria={setCriteria} />

      {renderContent()}

      <PaginationControls
        data={data ?? undefined}
        setCriteria={setCriteria}
        firstPage={firstPage}
        lastPage={lastPage}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
