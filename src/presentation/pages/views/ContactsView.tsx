import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  usePaginatedSearch,
  ContactCard,
  useUser,
  ContactEditorModal,
  ContactSearchForm,
  PaginationControls,
} from "@presentation";
import type { Contact } from "@domain";
import { apiDelete, type ContactCriteria } from "@application";

/**
 * Vista de gestión de contactos ("Mis Contactos").
 *
 * Funcionalidades:
 * 1. Listar contactos de la agenda del usuario.
 * 2. Añadir nuevos contactos (buscando por email).
 * 3. Editar el alias o notas de un contacto.
 * 4. Eliminar contactos.
 * 5. Gestionar etiquetas (tags) de contactos (delegado en `ContactCard`).
 */
export const ContactsView = () => {
  const { user: currentUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Contact | null>(
    null,
  );

  const {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
    refreshSearch: refetch,
    firstPage,
    lastPage,
  } = usePaginatedSearch<Contact, ContactCriteria>("/contacts/me", {
    page: 1,
    agendaOwnerId: currentUser.id,
  });

  // --- Handlers ---
  const handleOpenCreate = () => {
    setContactToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContactToEdit(null); // Asegurarse de limpiar el estado
  };

  const handleDeleteRequest = (contact: Contact) => {
    setShowDeleteConfirm(contact);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    try {
      await apiDelete(
        `/contacts/${currentUser.id}/${showDeleteConfirm.userId}`,
      );
      refetch(); // Refrescar la lista de contactos
    } catch (err) {
      console.error("Failed to delete contact", err);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleSuccess = () => {
    handleCloseModal();
    refetch();
  };

  // --- Render Logic ---
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
          Error al cargar los contactos: {error.message}
        </Alert>
      );
    }
    if (!data || data.results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>
          No se encontraron contactos con los filtros actuales.
        </Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.results.map((contact) => (
          <Grid item key={contact.userId} xs={12} sm={6} md={4} lg={3}>
            <ContactCard
              contact={contact}
              onClick={() => handleOpenEdit(contact)}
              onDelete={() => handleDeleteRequest(contact)}
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
          Mis Contactos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Añadir Contacto
        </Button>
      </Box>

      <ContactSearchForm criteria={criteria} setCriteria={setCriteria} />

      {renderContent()}

      <PaginationControls
        data={data ?? undefined}
        setCriteria={setCriteria}
        firstPage={firstPage}
        lastPage={lastPage}
      />

      <ContactEditorModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        contactToEdit={contactToEdit}
      />

      <Dialog open={!!showDeleteConfirm} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar a{" "}
            <strong>{showDeleteConfirm?.alias}</strong> de tus contactos? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
