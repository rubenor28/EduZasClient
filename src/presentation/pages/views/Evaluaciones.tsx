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
import type { Test } from "@domain";
import {
  type TestUpdate,
  apiDelete,
  apiPost,
  apiPut,
  ForbiddenError,
  type TestCriteria,
  type TestSummary,
  type NewTest,
  apiGet,
} from "@application";
import {
  TestCard,
  TestSearchForm,
  useUser,
  usePaginatedSearch,
  type MenuOption,
  PaginationControls,
} from "@presentation";
import type { OutputData } from "@editorjs/editorjs";

/**
 * Vista para que los profesores gestionen sus evaluaciones.
 * Permite ver, crear, editar, archivar y eliminar evaluaciones.
 */
export const Evaluaciones = () => {
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
  } = usePaginatedSearch<TestSummary, TestCriteria>(
    "/tests", // Endpoint for searching tests
    {
      page: 1,
      professorId: user.id,
    },
  );

  /**
   * Crea una estructura de contenido por defecto para una nueva evaluación.
   * @returns Un objeto `OutputData` para Editor.js.
   */
  const createDefaultContent = (): OutputData => ({
    time: Date.now(),
    blocks: [
      {
        id: crypto.randomUUID(),
        type: "header",
        data: {
          text: "Título de la Pregunta",
          level: 2,
        },
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        data: {
          text: "Escribe aquí la descripción o el enunciado de la pregunta.",
        },
      },
    ],
    version: "2.31.0",
  });

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const payload: NewTest = {
        title: "Nueva Evaluación",
        content: createDefaultContent(),
        professorId: user.id,
      };
      const newTest = await apiPost<TestSummary>("/test", payload);
      navigate(`/professor/tests/${newTest.id}`);
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Error al crear la nueva evaluación.",
        severity: "error",
      });
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (testId: string) => {
    navigate(`/professor/tests/${testId}`);
  };

  /**
   * Maneja el archivado de una evaluación.
   * Obtiene la evaluación completa, la actualiza a inactiva y la envía al backend.
   */
  const handleArchive = async (testData: TestSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres archivar la evaluación '${testData.title}'?`,
      )
    )
      return;

    try {
      const fullTest = await apiGet<Test>(`/tests/${testData.id}`);
      const payload: TestUpdate = { ...fullTest, active: false };
      await apiPut("/test", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La evaluación ha sido archivada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para archivar esta evaluación."
          : "Error al archivar la evaluación.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  /**
   * Maneja el desarchivado de una evaluación.
   * Obtiene la evaluación completa, la actualiza a activa y la envía al backend.
   */
  const handleUnarchive = async (testData: TestSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres desarchivar la evaluación '${testData.title}'?`,
      )
    )
      return;

    try {
      const fullTest = await apiGet<Test>(`/tests/${testData.id}`);
      const payload: TestUpdate = { ...fullTest, active: true };
      await apiPut("/test", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La evaluación ha sido desarchivada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para desarchivar esta evaluación."
          : "Error al desarchivado de la evaluación.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleDelete = async (testId: string) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta evaluación?")
    )
      return;
    try {
      await apiDelete(`/tests/${testId}`, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La evaluación ha sido eliminada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para eliminar esta evaluación."
          : "Error al eliminar la evaluación.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error)
      return (
        <Alert severity="error">Error al cargar las evaluaciones.</Alert>
      );
    if (!data || data.results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>
          No se encontraron evaluaciones.
        </Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((testData) => {
          const menuOptions: MenuOption[] = [];

          menuOptions.push({
            name: "Modificar",
            callback: () => handleEdit(testData.id),
          });

          if (testData.active) {
            menuOptions.push({
              name: "Archivar",
              callback: () => handleArchive(testData),
            });
          } else {
            menuOptions.push({
              name: "Desarchivar",
              callback: () => handleUnarchive(testData),
            });
          }

          menuOptions.push({
            name: "Eliminar",
            callback: () => handleDelete(testData.id),
          });

          return (
            <Grid item key={testData.id} xs={12} sm={6} md={4} lg={3}>
              <TestCard
                testData={testData}
                onClick={() => handleEdit(testData.id)}
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
          Mis Evaluaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={isCreating ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleCreate}
          disabled={isCreating}
        >
          Nueva Evaluación
        </Button>
      </Box>

      <TestSearchForm criteria={criteria} setCriteria={setCriteria} />

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
