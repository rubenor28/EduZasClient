import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  ClassCard,
  ClassSearchForm,
  ClassEditorModal,
  useUser,
  usePaginatedSearch,
  type MenuOption,
  PaginationControls,
  useOwnership,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingClassIsOwner, setEditingClassIsOwner] = useState(false);
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
  } = usePaginatedSearch<Class, ClassCriteria>("/classes/assigned", {
    page: 1,
    active: true,
    withProfessor: { id: user.id },
  });

  const ownershipMap = useOwnership(data?.results);

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setEditingClassIsOwner(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (classData: Class, isOwner: boolean) => {
    setEditingClass(classData);
    setEditingClassIsOwner(isOwner);
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
      const payload: ClassUpdate = { ...classData, active: false };
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
      const payload: ClassUpdate = { ...classData, active: true };
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

  const handleIsOwnerChange = (
    _e: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === null) return;
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      withProfessor: {
        ...prev.withProfessor!,
        isOwner: newValue === "all" ? undefined : newValue === "true",
      },
    }));
  };

  const isOwnerValue =
    criteria.withProfessor?.isOwner === undefined
      ? "all"
      : criteria.withProfessor.isOwner
        ? "true"
        : "false";

  const isOwnerToggle = (
    <ToggleButtonGroup
      value={isOwnerValue}
      exclusive
      onChange={handleIsOwnerChange}
      size="small"
    >
      <ToggleButton value="true">Propias</ToggleButton>
      <ToggleButton value="false">Ajenas</ToggleButton>
      <ToggleButton value="all">Todas</ToggleButton>
    </ToggleButtonGroup>
  );

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
          const isOwner = ownershipMap.get(classData.id) ?? false;
          const menuOptions: MenuOption[] = [];

          if (isOwner || isAdmin) {
            menuOptions.push({
              name: "Modificar",
              callback: () => handleOpenEditModal(classData, isOwner),
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
              callback: () => handleDelete(classData.id),
            });
          }

          return (
            <Grid item key={classData.id} xs={12} sm={6} md={4} lg={3}>
              <ClassCard
                classData={classData}
                onClick={() => { }}
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

      <ClassSearchForm
        criteria={criteria}
        setCriteria={setCriteria}
        viewSpecificFields={isOwnerToggle}
      />

      {renderContent()}

      <PaginationControls data={data ?? undefined} setCriteria={setCriteria} firstPage={firstPage} lastPage={lastPage} />

      <ClassEditorModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classToEdit={editingClass}
        isCurrentUserOwner={isAdmin || editingClassIsOwner}
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
