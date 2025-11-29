import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Switch,
  CircularProgress,
  Alert,
  Box,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import type {
  ClassResourceAssociationDTO,
  ClassResourceAssociationCriteria,
  PaginatedQuery,
} from "@application";
import { apiPost, apiDelete, InputError } from "@application";
import { useUser, usePaginatedSearch, PaginationControls } from "@presentation";

type AssociationState = ClassResourceAssociationDTO & { isHidden: boolean };

type Changes = {
  toAdd: { classId: string; hidden: boolean }[];
  toRemove: string[];
  toUpdate: { classId: string; hidden: boolean }[];
};

const initialChanges: Changes = { toAdd: [], toRemove: [], toUpdate: [] };

export const ClassAssociationManager = ({
  open,
  onClose,
  resourceId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  resourceId: string;
  onSuccess: () => void;
}) => {
  const { user } = useUser();
  
  const [localAssociations, setLocalAssociations] = useState<Map<string, AssociationState>>(new Map());
  const [initialState, setInitialState] = useState<Map<string, AssociationState>>(new Map());
  const [changes, setChanges] = useState<Changes>(initialChanges);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    criteria,
    setCriteria,
    data,
    isLoading,
    error,
  } = usePaginatedSearch<AssociationState, ClassResourceAssociationCriteria>("/resources/assigned", {
    page: 1,
    pageSize: 10,
    professorId: user.id,
    resourceId: resourceId,
  }, {
    enabled: open, // Only run the hook when the modal is open
  });

  useEffect(() => {
    if (open) {
        // When modal opens, if there's data, initialize the states
        if (data) {
            const initialMap = new Map(data.results.map(a => [a.classId, a]));
            setInitialState(initialMap);
            setLocalAssociations(initialMap);
            setChanges(initialChanges);
            setSubmitError(null);
        }
    }
  }, [open, data]);


  const handleAssociationToggle = (classId: string, currentIsAssociated: boolean) => {
    const wasOriginallyAssociated = initialState.get(classId)?.isAssociated ?? false;

    setLocalAssociations(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(classId)!;
        newMap.set(classId, { ...current, isAssociated: !currentIsAssociated });
        return newMap;
    });

    setChanges(prev => {
      const newChanges: Changes = { ...prev };
      if (!currentIsAssociated) { // Toggling ON
        newChanges.toRemove = newChanges.toRemove.filter(id => id !== classId);
        if (!wasOriginallyAssociated) {
            newChanges.toAdd = newChanges.toAdd.filter(c => c.classId !== classId);
            newChanges.toAdd.push({ classId, hidden: false });
        }
      } else { // Toggling OFF
        newChanges.toAdd = newChanges.toAdd.filter(c => c.classId !== classId);
        newChanges.toUpdate = newChanges.toUpdate.filter(c => c.classId !== classId);
        if (wasOriginallyAssociated) {
            if (!newChanges.toRemove.includes(classId)) newChanges.toRemove.push(classId);
        }
      }
      return newChanges;
    });
  };
  
  const handleHiddenToggle = (classId: string, currentIsHidden: boolean) => {
      setLocalAssociations(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(classId)!;
        newMap.set(classId, { ...current, isHidden: !currentIsHidden });
        return newMap;
      });

      setChanges(prev => {
          const newChanges: Changes = { ...prev };
          const newHiddenState = !currentIsHidden;
          const wasOriginallyAssociated = initialState.get(classId)?.isAssociated ?? false;

          const pendingAdd = newChanges.toAdd.find(c => c.classId === classId);
          if (pendingAdd) {
              pendingAdd.hidden = newHiddenState;
              return newChanges;
          }

          if (wasOriginallyAssociated) {
              newChanges.toUpdate = newChanges.toUpdate.filter(c => c.classId !== classId);
              if (initialState.get(classId)!.isHidden !== newHiddenState) {
                  newChanges.toUpdate.push({ classId, hidden: newHiddenState });
              }
          }
          return newChanges;
      });
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const promises = [
        ...changes.toAdd.map(c => 
            apiPost("/resources/association", { resourceId, classId: c.classId, hidden: c.hidden }, { parseResponse: "void" })
        ),
        ...changes.toUpdate.map(c => 
            apiPost("/resources/association", { resourceId, classId: c.classId, hidden: c.hidden }, { parseResponse: "void" })
        ),
        ...changes.toRemove.map(classId =>
            apiDelete("/resources/association", { data: { resourceId, classId }, parseResponse: "void" })
        ),
      ];
      await Promise.all(promises);
      onSuccess();
      onClose();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Error inesperado al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => !isSubmitting && onClose();
  const hasChanges = changes.toAdd.length > 0 || changes.toRemove.length > 0 || changes.toUpdate.length > 0;
  
  const currentViewAssociations = useMemo(() => {
      return data?.results.map(assoc => localAssociations.get(assoc.classId) || assoc) || [];
  }, [data, localAssociations]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Recurso a Clases</DialogTitle>
      <DialogContent sx={{ p: 2, bgcolor: 'background.default' }}>
        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
        {error && !isLoading && <Alert severity="warning" sx={{ mb: 2 }}>{error.message}</Alert>}
        
        {isLoading && !data ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}><CircularProgress /></Box>
        ) : !data || data.results.length === 0 ? (
          <Alert severity="info">No tienes clases para asignar este recurso.</Alert>
        ) : (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            {currentViewAssociations.map((assoc, index) => (
              <>
                <ListItem key={assoc.classId} dense sx={{ py: 1.5 }}>
                  <ListItemText primary={assoc.className} sx={{ flexGrow: 1 }}/>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {assoc.isAssociated && (
                        <FormControlLabel
                            sx={{ mr: 0, color: 'text.secondary' }}
                            control={
                                <Switch
                                    checked={assoc.isHidden}
                                    onChange={() => handleHiddenToggle(assoc.classId, assoc.isHidden)}
                                    disabled={isSubmitting}
                                    size="small"
                                />
                            }
                            label="Oculto"
                            labelPlacement="start"
                        />
                    )}
                    <Button
                        variant="outlined"
                        size="small"
                        color={assoc.isAssociated ? 'error' : 'primary'}
                        onClick={() => handleAssociationToggle(assoc.classId, assoc.isAssociated)}
                        disabled={isSubmitting}
                        sx={{ width: '90px' }}
                    >
                        {assoc.isAssociated ? 'Eliminar' : 'Agregar'}
                    </Button>
                  </Box>
                </ListItem>
                {index < currentViewAssociations.length - 1 && <Divider component="li" />}
              </>
            ))}
          </List>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <PaginationControls data={data as PaginatedQuery<unknown, unknown>} setCriteria={setCriteria} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || isLoading || !hasChanges}>
          {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
