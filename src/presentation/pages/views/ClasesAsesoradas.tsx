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
import type { ProfessorClassesSummary } from "@application";
import {
  type ClassUpdate,
  apiDelete,
  apiPut,
  ForbiddenError,
  type ProfessorClassesSummaryCriteria,
} from "@application";
import {
  ClassSearchForm,
  ClassEditorModal,
  useUser,
  usePaginatedSearch,
  type MenuOption,
  PaginationControls,
  ClassCard,
} from "@presentation";

/**
 * Vista principal para profesores: "Clases Asesoradas".
 *
 * Funcionalidades:
 * 1. Listar clases donde el usuario es profesor o colaborador.
 * 2. Crear nuevas clases.
 * 3. Editar clases existentes (si es propietario o admin).
 * 4. Archivar/Desarchivar clases.
 * 5. Eliminar clases (si es propietario o admin).
 *
 * Utiliza `usePaginatedSearch` para la carga de datos y `useOwnership` para determinar permisos.
 */
export const ClasesAsesoradas = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] =
    useState<ProfessorClassesSummary | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const isAdmin = user.role === 2;

  const {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
    refreshSearch: refetch,
    firstPage,
    lastPage,
  } = usePaginatedSearch<
    ProfessorClassesSummary,
    ProfessorClassesSummaryCriteria
  >("/classes/assigned", {
    page: 1,
    pageSize: 12,
    active: true,
    professorId: user.id,
  });

  const onSucces = () => {
    refetch();
    let action = editingClass === null ? "creada" : "actualizada";
    setSnackbar({
      open: true,
      severity: "success",
      message: `Clase ${action} correctamente`,
    });
  };

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (classData: ProfessorClassesSummary) => {
    setEditingClass(classData);
    setIsModalOpen(true);
  };

  const handleArchive = async (classData: ProfessorClassesSummary) => {
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
        id: classData.classId,
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

  const handleUnarchive = async (classData: ProfessorClassesSummary) => {
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
        id: classData.classId,
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
          const isOwner = classData.owner;
          const menuOptions: MenuOption[] = [];

          if (isOwner || isAdmin) {
            menuOptions.push({
              name: "Modificar",
              callback: () => handleOpenEditModal(classData),
            });
          }

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

          if (isOwner || isAdmin) {
            menuOptions.push({
              name: "Eliminar",
              callback: () => handleDelete(classData.classId),
            });
          }

          return (
            <Grid item key={classData.classId} xs={12} sm={6} md={4} lg={3}>
              <ClassCard
                classData={{ ...classData, id: classData.classId }}
                onClick={(id) => navigate(`/professor/classes/${id}/content`)}
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
          Clases Asesoradas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Nueva Clase
        </Button>
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
        classToEdit={
          editingClass
            ? {
                id: editingClass.classId,
                active: editingClass.active,
                className: editingClass.className,
                subject: editingClass.subject,
                section: editingClass.section,
                color: editingClass.color,
              }
            : null
        }
        isCurrentUserOwner={isAdmin || (editingClass?.owner ?? false)}
        onSuccess={onSucces}
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
