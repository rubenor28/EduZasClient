import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import type { Class } from "@domain";
import {
  type ClassUpdate,
  apiDelete,
  apiPut,
  ForbiddenError,
  type ClassCriteria,
} from "@application";
import {
  ClassSearchForm,
  ClassEditorModal,
  usePaginatedSearch,
  type MenuOption,
  PaginationControls,
  ClassCard,
} from "@presentation";

/**
 * Vista para administradores: "Gestionar Clases".
 *
 * Funcionalidades:
 * 1. Listar todas las clases del sistema.
 * 2. Editar clases existentes.
 * 3. Archivar/Desarchivar clases.
 * 4. Eliminar clases.
 *
 */
export const ManageClassesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
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
  } = usePaginatedSearch<Class, ClassCriteria>("/classes/all", {
    page: 1,
    pageSize: 12,
    active: true,
  });

  const handleOpenEditModal = (classData: Class) => {
    setEditingClass(classData);
    setIsModalOpen(true);
  };

  const handleArchive = async (classData: Class) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres archivar la clase '${classData.className}'?`,
      )
    )
      return;
    try {
      const payload: ClassUpdate = {
        ...classData,
        active: false,
      };
      await apiPut("/classes", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La clase ha sido archivada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para archivar esta clase."
          : "Error al archivar la clase.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleUnarchive = async (classData: Class) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres desarchivar la clase '${classData.className}'?`,
      )
    )
      return;
    try {
      const payload: ClassUpdate = {
        ...classData,
        active: true,
      };
      await apiPut("/classes", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La clase ha sido desarchivada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para desarchivar esta clase."
          : "Error al desarchivar la clase.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleDelete = async (classId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta clase?"))
      return;
    try {
      await apiDelete(`/classes/${classId}`, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "La clase ha sido eliminada.",
        severity: "success",
      });
    } catch (err) {
      const message =
        err instanceof ForbiddenError
          ? "No tienes permiso para eliminar esta clase."
          : "Error al eliminar la clase.";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error)
      return <Alert severity="error">Error al cargar las clases.</Alert>;
    if (!data || data.results.length === 0) {
      return <Typography sx={{ mt: 2 }}>No se encontraron clases.</Typography>;
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((classData) => {
          const menuOptions: MenuOption[] = [
            {
              name: "Modificar",
              callback: () => handleOpenEditModal(classData),
            },
          ];

          if (classData.active) {
            menuOptions.push({
              name: "Archivar",
              callback: () => handleArchive(classData),
            });
          } else {
            menuOptions.push({
              name: "Desarchivar",
              callback: () => handleUnarchive(classData),
            });
          }

          menuOptions.push({
            name: "Eliminar",
            callback: () => handleDelete(classData.id),
          });

          return (
            <Grid item key={classData.id} xs={12} sm={6} md={4} lg={3}>
              <ClassCard
                classData={classData}
                onClick={() => {
                  /* TODO: Definir navegación para admin */
                }}
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
        }}
      >
        <Typography variant="h4" gutterBottom>
          Gestionar Clases
        </Typography>
      </Box>

      <ClassSearchForm criteria={criteria} setCriteria={setCriteria} />

      {renderContent()}

      <PaginationControls
        data={data ?? undefined}
        setCriteria={setCriteria}
        firstPage={firstPage}
        lastPage={lastPage}
      />

      <ClassEditorModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classToEdit={editingClass}
        isCurrentUserOwner={true}
        onSuccess={refetch}
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
