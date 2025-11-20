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
} from "@mui/material";
import { useState } from "react";
import type { Class } from "@domain";
import { apiClient } from "@application";
import {
  ClassCard,
  ClassSearchForm,
  type MenuOption,
  useUser,
  useClassSearch,
} from "@presentation";

export const ClasesInscritas = () => {
  const { user } = useUser();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const { criteria, setCriteria, data, isLoading, error, refetch } =
    useClassSearch("/classes/enrolled", {
      page: 1,
      active: true,
      withStudent: { id: user.id, hidden: false },
    });

  const handleToggleHidden = async (classId: string, shouldHide: boolean) => {
    const action = shouldHide ? "ocultar" : "mostrar";
    try {
      const payload = { userId: user.id, classId: classId, hidden: shouldHide };
      await apiClient.put("/classes/students/relationship", payload);
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

  const getMenuOptions = (classData: Class): MenuOption[] => {
    const isHidden = data?.criteria.withStudent?.hidden;
    const options: MenuOption[] = [];

    if (isHidden) {
      options.push({
        name: "Mostrar clase",
        callback: () => handleToggleHidden(classData.id, false),
      });
    } else {
      options.push({
        name: "Ocultar clase",
        callback: () => handleToggleHidden(classData.id, true),
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
      withStudent: {
        ...prev.withStudent!,
        hidden:
          newValue === "all" ? undefined : newValue === "true" ? true : false,
      },
    }));
  };

  const hiddenValue =
    criteria.withStudent?.hidden === undefined
      ? "all"
      : criteria.withStudent.hidden
      ? "true"
      : "false";

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
        <Alert severity="error">Error al cargar las clases: {error.message}</Alert>
      );
    }
    if (!data || data.results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>No se encontraron clases.</Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((classData) => (
          <Grid item key={classData.id} xs={12} sm={6} md={4} lg={3}>
            <ClassCard
              classData={classData}
              onClick={() => {}}
              menuOptions={getMenuOptions(classData)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: "transparent", boxShadow: "none" }}>
      <Typography variant="h4" gutterBottom>
        Clases Inscritas
      </Typography>

      <ClassSearchForm
        criteria={criteria}
        setCriteria={setCriteria}
        viewSpecificFields={hiddenToggle}
      />

      {renderContent()}
      
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
