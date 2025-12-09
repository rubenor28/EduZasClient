import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  Toolbar,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import type { User } from "@domain";
import {
  apiDelete,
  apiPut,
  type UserCriteria,
  type UpdateUser,
  InputError,
} from "@application";
import {
  usePaginatedSearch,
  PaginationControls,
  UserSearchForm,
  UsersTable,
  UserEditorModal,
} from "@presentation";

/**
 * Vista de administración de usuarios.
 *
 * Funcionalidades:
 * 1. Listar todos los usuarios del sistema (paginado).
 * 2. Filtrar usuarios por criterios (nombre, email, rol).
 * 3. Crear nuevos usuarios (Admin).
 * 4. Editar usuarios existentes.
 * 5. Archivar/Desarchivar usuarios (soft delete).
 * 6. Eliminar usuarios permanentemente.
 */
export const UsersView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "error" });

  const {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
    refreshSearch: refetch,
    firstPage,
    lastPage,
  } = usePaginatedSearch<User, UserCriteria>("/users/all", {
    page: 1,
    pageSize: 8,
    active: true,
  });

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedUser) return;
    setIsModalOpen(true);
  };

  const handleToggleArchive = async () => {
    if (!selectedUser) return;
    const isArchiving = selectedUser.active;
    const action = isArchiving ? "archivar" : "desarchivar";
    if (
      !window.confirm(
        `¿Estás seguro de que quieres ${action} al usuario '${selectedUser.email}'?`,
      )
    )
      return;

    try {
      const payload: UpdateUser = {
        ...selectedUser,
        active: !isArchiving,
        password: null
      };
      await apiPut("/users", payload, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: `El usuario ha sido ${action}.`,
        severity: "success",
      });
      setSelectedUser(null);
    } catch (err) {
      if (err instanceof InputError) {
        console.error(err.message)
        console.error(err.errors);
      }
      setSnackbar({
        open: true,
        message: `Error al ${action} el usuario.`,
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción es permanente."))
      return;

    try {
      await apiDelete(`/users/${selectedUser.id}`, { parseResponse: "void" });
      refetch();
      setSnackbar({
        open: true,
        message: "El usuario ha sido eliminado.",
        severity: "success",
      });
      setSelectedUser(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el usuario.",
        severity: "error",
      });
    }
  };

  const handleSuccess = () => {
    refetch();
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error)
      return <Alert severity="error">Error al cargar los usuarios: {error.message}</Alert>;
    if (!data || data.results.length === 0) {
      return <Typography sx={{ mt: 4, textAlign: 'center' }}>No se encontraron usuarios.</Typography>;
    }
    return (
      <UsersTable
        users={data.results}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <UserSearchForm
        criteria={criteria}
        setCriteria={setCriteria}
      />

      <Paper>
        <Toolbar sx={{ justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Nuevo
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenEditModal}
            disabled={!selectedUser}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={selectedUser?.active ? <ArchiveIcon /> : <UnarchiveIcon />}
            onClick={handleToggleArchive}
            disabled={!selectedUser}
          >
            {selectedUser?.active ? "Archivar" : "Desarchivar"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={!selectedUser}
          >
            Eliminar
          </Button>
        </Toolbar>
        <Divider />
        {renderContent()}
        <PaginationControls data={data ?? undefined} setCriteria={setCriteria} firstPage={firstPage} lastPage={lastPage} />
      </Paper>


      <UserEditorModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={selectedUser}
        onSuccess={handleSuccess}
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
