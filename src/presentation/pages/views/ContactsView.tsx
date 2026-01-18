import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
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

  const handleDelete = async (contact: Contact) => {
    const deleteConfirm = window.confirm(
      `¿Estás seguro que quieres eliminar este contacto? Esta tarea no puede deshacerse`,
    );

    if (!deleteConfirm) return;
    try {
      await apiDelete(`/contacts/${currentUser.id}/${contact.userId}`);
      refetch(); // Refrescar la lista de contactos
    } catch (err) {
      console.error("Failed to delete contact", err);
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
              onDelete={() => handleDelete(contact)}
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
    </Paper>
  );
};
