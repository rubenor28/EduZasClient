import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  apiDelete,
  apiPut,
  NotFoundError,
  type StudentClassesSummary,
  type StudentClassesSummaryCriteria,
} from "@application";
import {
  ClassCard,
  ClassSearchForm,
  type MenuOption,
  useUser,
  usePaginatedSearch,
  EnrollClassModal,
  PaginationControls,
} from "@presentation";

/**
 * Vista principal para estudiantes: "Clases Inscritas".
 *
 * Funcionalidades:
 * 1. Listar clases en las que el estudiante está inscrito.
 * 2. Inscribirse en nuevas clases mediante código.
 * 3. Ocultar/Mostrar clases (soft delete visual para el estudiante).
 * 4. Abandonar clases.
 */
export const ClasesInscritas = () => {
  const { user } = useUser();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

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
  } = usePaginatedSearch<StudentClassesSummary, StudentClassesSummaryCriteria>(
    "/classes/enrolled",
    {
      page: 1,
      pageSize: 12,
      active: true,
      studentId: user.id,
      hidden: false,
    },
  );

  const handleToggleHidden = async (classId: string, shouldHide: boolean) => {
    const action = shouldHide ? "ocultar" : "mostrar";
    try {
      const payload = { userId: user.id, classId: classId, hidden: shouldHide };
      await apiPut("/classes/students/relationship", payload, {
        parseResponse: "void",
      });
      refetch();
      setSnackbar({
        open: true,
        message: `La clase se ha ${action} correctamente.`,
        severity: "success",
      });
    } catch (err) {
      console.error(`Error al ${action} la clase:`, err);
      setSnackbar({
        open: true,
        message: `No se pudo ${action} la clase.`,
        severity: "error",
      });
    }
  };

  const handleUnenroll = async (classId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres abandonar esta clase?")) {
      return;
    }
    try {
      await apiDelete(`/classes/enroll/${classId}/${user.id}`, {
        parseResponse: "void",
      });
      refetch(); // Refrescar la lista de clases inscritas
      setSnackbar({
        open: true,
        message: "Has abandonado la clase correctamente.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error al abandonar la clase:", err);
      let errorMessage = "Error al abandonar la clase.";
      if (err instanceof NotFoundError) {
        errorMessage = "Ya no estás inscrito en esta clase o no se encontró.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const getMenuOptions = (classData: StudentClassesSummary): MenuOption[] => {
    const options: MenuOption[] = [
      {
        name: "Abandonar Clase",
        callback: () => handleUnenroll(classData.classId),
      },
    ];

    const isHidden = classData.hidden;
    // Opciones de ocultar/mostrar clase, se añaden después de abandonar
    if (isHidden) {
      options.push({
        name: "Mostrar clase",
        callback: () => handleToggleHidden(classData.classId, false),
      });
    } else {
      options.push({
        name: "Ocultar clase",
        callback: () => handleToggleHidden(classData.classId, true),
      });
    }
    return options;
  };

  const handleHiddenChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === null) return;
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      hidden:
        newValue === "all" ? undefined : newValue === "true" ? true : false,
    }));
  };

  const hiddenValue =
    criteria.hidden === undefined ? "all" : criteria.hidden ? "true" : "false";

  const hiddenToggle = (
    <ToggleButtonGroup
      value={hiddenValue}
      exclusive
      onChange={handleHiddenChange}
      size="small"
    >
      <ToggleButton value="false">Visibles</ToggleButton>
      <ToggleButton value="true">Ocultas</ToggleButton>
      <ToggleButton value="all">Todas</ToggleButton>
    </ToggleButtonGroup>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error">
          Error al cargar las clases: {error.message}
        </Alert>
      );
    }
    if (!data || data.results.length === 0) {
      return <Typography sx={{ mt: 2 }}>No se encontraron clases.</Typography>;
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((classData) => (
          <Grid item key={classData.classId} xs={12} sm={6} md={4} lg={3}>
            <ClassCard
              classData={{
                id: classData.classId,
                active: classData.active,
                className: classData.className,
                subject: classData.subject,
                section: classData.section,
                color: classData.color,
              }}
              onClick={() => {}}
              isLoading={isLoading}
              menuOptions={getMenuOptions(classData)}
            />
          </Grid>
        ))}
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
          Clases Inscritas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsEnrollModalOpen(true)}
        >
          Inscribirse
        </Button>
      </Box>

      <ClassSearchForm criteria={criteria} setCriteria={setCriteria} />
      {hiddenToggle}

      {renderContent()}

      <PaginationControls
        data={data ?? undefined}
        setCriteria={setCriteria}
        firstPage={firstPage}
        lastPage={lastPage}
      />

      <EnrollClassModal
        open={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSuccess={() => {
          refetch();
          setSnackbar({
            open: true,
            message: "¡Inscripción exitosa!",
            severity: "success",
          });
        }}
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
