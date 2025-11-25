import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { User, Contact } from "@domain";
import { usePaginatedSearch, useUser } from "@presentation";
import type { ContactCriteria } from "@application";

// Tipos unificados para la gestión interna del componente
export type ProfessorInfo = {
  id: number;
  name: string;
  email: string;
};

type ManagedProfessor = {
  info: ProfessorInfo;
  isOwner: boolean;
  status: "existing" | "added" | "removed";
  originalIsOwner: boolean;
};

// Objeto que comunica los cambios al componente padre
export type ProfessorSelectorChanges = {
  toAdd: { userId: number; isOwner: boolean }[];
  toRemove: { userId: number }[];
  toUpdate: { userId: number; isOwner: boolean }[];
};

type ProfessorSelectorProps = {
  isEditMode?: boolean;
  initialProfessors: { user: User; isOwner: boolean }[];
  isCurrentUserOwner: boolean;
  onChange: (changes: ProfessorSelectorChanges) => void;
  open: boolean;
};

export const ProfessorSelector = ({
  isEditMode = false,
  initialProfessors,
  isCurrentUserOwner,
  onChange,
  open,
}: ProfessorSelectorProps) => {
  const { user } = useUser();
  const [managedProfessors, setManagedProfessors] = useState<ManagedProfessor[]>([]);
  
  const [hasSearchedContacts, setHasSearchedContacts] = useState(false);
  const { data: contactsData, isLoading: isLoadingContacts, error: contactsError, refreshSearch: searchContacts } = usePaginatedSearch<Contact, ContactCriteria>("/contacts/me", { page: 1, agendaOwnerId: user.id }, { autoFetch: false });

  useEffect(() => {
    if (open && !hasSearchedContacts) {
      searchContacts();
      setHasSearchedContacts(true);
    }
    if (!open) {
      setHasSearchedContacts(false);
      setManagedProfessors([]);
    }
  }, [open, hasSearchedContacts, searchContacts]);

  useEffect(() => {
    // Cuando el modal se abre o los profesores iniciales cambian, resetea el estado
    if (open) {
      const initial: ManagedProfessor[] = initialProfessors.map(({ user: p, isOwner }) => ({
        info: { id: p.id, name: `${p.firstName} ${p.fatherLastname}`, email: p.email },
        isOwner,
        status: 'existing',
        originalIsOwner: isOwner,
      }));
      setManagedProfessors(initial);
    }
  }, [open, initialProfessors]);

  useEffect(() => {
    const toAdd = managedProfessors
        .filter(p => p.status === 'added')
        .map(p => ({ userId: p.info.id, isOwner: p.isOwner }));
    
    const toRemove = managedProfessors
        .filter(p => p.status === 'removed' && p.originalIsOwner !== undefined)
        .map(p => ({userId: p.info.id}));

    const toUpdate = managedProfessors
      .filter(p => p.status === 'existing' && p.isOwner !== p.originalIsOwner)
      .map(p => ({ userId: p.info.id, isOwner: p.isOwner }));

    onChange({ toAdd, toRemove, toUpdate });
  }, [managedProfessors, onChange]);

  const handleAddFromContacts = (contact: Contact & { email?: string }) => {
    const newProfessor: ManagedProfessor = {
      info: { id: contact.userId, name: contact.alias, email: contact.email ?? 'No disponible' },
      isOwner: false,
      status: 'added',
      originalIsOwner: false
    };
    setManagedProfessors(prev => [...prev, newProfessor]);
  };

  const handleRemove = (profId: number) => {
    setManagedProfessors(prev => {
      const professor = prev.find(p => p.info.id === profId);
      if (!professor) return prev;
      
      if (professor.status === 'added') {
        return prev.filter(p => p.info.id !== profId);
      }

      return prev.map(p => p.info.id === profId ? { ...p, status: 'removed' } : p);
    });
  };

  const handleUndoRemove = (profId: number) => {
    setManagedProfessors(prev =>
      prev.map(p =>
        p.info.id === profId ? { ...p, status: 'existing' } : p
      )
    );
  };
  
  const handleOwnerChange = (profId: number, newIsOwner: boolean) => {
    setManagedProfessors(prev => prev.map(p => 
        p.info.id === profId ? { ...p, isOwner: newIsOwner } : p
    ));
  };

  const renderProfessorList = () => {
    const activeProfessorsCount = useMemo(() => 
        managedProfessors.filter(p => p.status !== 'removed').length,
    [managedProfessors]);

    return (
      <List dense>
        {managedProfessors.map(p => {
          const isRemoved = p.status === 'removed';
          
          return (
              <ListItem 
                  key={p.info.id} 
                  divider
                  sx={{ 
                    textDecoration: isRemoved ? 'line-through' : 'none',
                    opacity: isRemoved ? 0.5 : 1,
                    transition: 'opacity 0.2s, text-decoration 0.2s',
                  }}
              >
                  <ListItemText primary={p.info.name} secondary={p.status === 'added' ? 'Nuevo profesor a agregar' : p.info.email} />
                  <ListItemSecondaryAction>
                  {isCurrentUserOwner && !isRemoved && (
                      <Tooltip title="Hacer dueño de la clase">
                      <FormControlLabel
                          control={<Switch checked={p.isOwner} onChange={(e) => handleOwnerChange(p.info.id, e.target.checked)} size="small" />}
                          label="Dueño"
                      />
                      </Tooltip>
                  )}
                  {isRemoved ? (
                    <Button size="small" onClick={() => handleUndoRemove(p.info.id)} color="warning">
                      Deshacer
                    </Button>
                  ) : (
                    isCurrentUserOwner && (
                      <Button 
                        size="small" 
                        onClick={() => handleRemove(p.info.id)} 
                        color="error"
                        disabled={activeProfessorsCount <= 1} // Disable if this is the last active professor
                      >
                        {p.status === 'added' ? 'Quitar' : 'Eliminar'}
                      </Button>
                    )
                  )}
                  </ListItemSecondaryAction>
              </ListItem>
          );
        })}
         {managedProfessors.length === 0 && <Typography variant="body2" sx={{pl:2, fontStyle: 'italic'}}>No hay profesores asignados a esta clase.</Typography>}
      </List>
    );
  };

  const renderContactList = () => {
    if (isLoadingContacts) return <CircularProgress sx={{display: 'block', margin: 'auto', my: 2}} />;
    if (contactsError) return <Alert severity="error" sx={{my: 2}}>Error al cargar contactos.</Alert>;
    if (!contactsData || contactsData.results.length === 0) {
      return (
        <Box textAlign="center" my={2}>
          <Typography>Aún no tienes contactos.</Typography>
          <Button component={RouterLink} to="/professor/contacts" variant="contained" sx={{ mt: 1 }}>
            Agregar Contactos
          </Button>
        </Box>
      );
    }
    
    const professorIds = new Set(managedProfessors.map(p => p.info.id));
    const availableContacts = contactsData.results.filter(
      (contact) => !professorIds.has(contact.userId)
    );

    return (
        <List dense>
        {availableContacts.map((contact) => (
            <ListItem key={contact.userId}>
            <ListItemText primary={contact.alias} secondary={(contact as any).email} />
            <ListItemSecondaryAction>
                <Button size="small" onClick={() => handleAddFromContacts(contact)} variant="outlined">
                Agregar
                </Button>
            </ListItemSecondaryAction>
            </ListItem>
        ))}
        {availableContacts.length === 0 && <Typography variant="body2" sx={{pl:2, fontStyle: 'italic'}}>Todos tus contactos ya están en la clase.</Typography>}
        </List>
    );
  }

  if (!isCurrentUserOwner && isEditMode) {
    return (
      <Box sx={{ mt: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Profesores
        </Typography>
        <List dense>
        {managedProfessors.map(p => (
           <ListItem key={p.info.id}>
             <ListItemText 
                primary={p.info.name} 
                secondary={p.info.email} />
           </ListItem>
        ))}
        </List>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Gestionar Profesores
      </Typography>
      
      {renderProfessorList()}
      
      <Divider sx={{ my: 2 }}><Chip label="Añadir desde Contactos" /></Divider>
      
      {renderContactList()}
    </Box>
  );
};
