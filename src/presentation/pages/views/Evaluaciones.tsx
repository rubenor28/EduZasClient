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
import { QuestionTypes, type QuestionVariant, type Test } from "@domain";
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
import { v4 as uuidv4 } from "uuid";

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
  } = usePaginatedSearch<TestSummary, TestCriteria>("/tests", {
    page: 1,
    pageSize: 12,
    active: true,
    professorId: user.id,
  });

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const id = uuidv4();
      const defaultQuestion: QuestionVariant<QuestionTypes.Open> = {
        type: QuestionTypes.Open,
        title: "Nueva pregunta",
      };

      const payload: NewTest = {
        title: "Nueva Evaluación",
        color: "#1976d2",
        content: {
          [id]: defaultQuestion,
        },
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

  const handleArchive = async (testData: TestSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres archivar la evaluación '${testData.title}'?`,
      )
    )
      return;

    try {
      const fullTest = await apiGet<Test>(`/tests/${testData.id}`);
      const payload: TestUpdate = {
        ...fullTest,
        active: false,
        professorId: user.id,
      };
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

  const handleUnarchive = async (testData: TestSummary) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres desarchivar la evaluación '${testData.title}'?`,
      )
    )
      return;

    try {
      const fullTest = await apiGet<Test>(`/tests/${testData.id}`);
      const payload: TestUpdate = {
        ...fullTest,
        active: true,
        professorId: user.id,
      };
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
      return <Alert severity="error">Error al cargar las evaluaciones.</Alert>;
    if (!data || data.results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>No se encontraron evaluaciones.</Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((testData) => {
          const menuOptions: MenuOption[] = [
            { name: "Modificar", callback: () => handleEdit(testData.id) },
            testData.active
              ? { name: "Archivar", callback: () => handleArchive(testData) }
              : {
                  name: "Desarchivar",
                  callback: () => handleUnarchive(testData),
                },
            { name: "Eliminar", callback: () => handleDelete(testData.id) },
          ];

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
