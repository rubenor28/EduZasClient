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
  ClassResourceAssociation,
  ClassResourceAssociationCriteria,
  ClassResource,
} from "@application";
import { apiPost, apiDelete, apiPut } from "@application";
import { useUser, usePaginatedSearch, PaginationControls } from "@presentation";

type Changes = {
  toAdd: { classId: string; hidden: boolean }[];
  toRemove: string[];
  toUpdate: { classId: string; hidden: boolean }[];
};

const initialChanges: Changes = { toAdd: [], toRemove: [], toUpdate: [] };

export const ResourceClassAssociationManager = ({
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

  const [localAssociations, setLocalAssociations] = useState<
    Map<string, ClassResourceAssociation>
  >(new Map());
  const [initialState, setInitialState] = useState<
    Map<string, ClassResourceAssociation>
  >(new Map());
  const [changes, setChanges] = useState<Changes>(initialChanges);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    setCriteria,
    firstPage,
    lastPage,
    data,
    isLoading,
    error,
    refreshSearch,
  } = usePaginatedSearch<
    ClassResourceAssociation,
    ClassResourceAssociationCriteria
  >(
    "/resources/assigned",
    {
      page: 1,
      professorId: user.id,
      resourceId: resourceId,
    },
    { autoFetch: open }
  );

  useEffect(() => {
    if (open) refreshSearch();
  }, [open, refreshSearch]);

  useEffect(() => {
    if (open && data) {
      const initialMap = new Map(data.results.map((a) => [a.classId, a]));
      setInitialState(initialMap);
      setLocalAssociations(initialMap);
      setChanges(initialChanges);
      setSubmitError(null);
    }
  }, [open, data]);

  const handleAssociationToggle = (
    classId: string,
    currentIsAssociated: boolean
  ) => {
    const wasOriginallyAssociated =
      initialState.get(classId)?.isAssociated ?? false;
    const newIsAssociated = !currentIsAssociated;

    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isAssociated: newIsAssociated });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges: Changes = {
        toAdd: [...prev.toAdd],
        toRemove: [...prev.toRemove],
        toUpdate: [...prev.toUpdate],
      };

      if (newIsAssociated === wasOriginallyAssociated) {
        newChanges.toAdd = newChanges.toAdd.filter(
          (c) => c.classId !== classId
        );
        newChanges.toRemove = newChanges.toRemove.filter(
          (id) => id !== classId
        );
      } else if (newIsAssociated) {
        newChanges.toRemove = newChanges.toRemove.filter(
          (id) => id !== classId
        );
        if (!newChanges.toAdd.find((c) => c.classId === classId)) {
          newChanges.toAdd.push({
            classId,
            hidden: false, // Default to visible
          });
        }
      } else {
        newChanges.toAdd = newChanges.toAdd.filter(
          (c) => c.classId !== classId
        );
        newChanges.toUpdate = newChanges.toUpdate.filter(
          (c) => c.classId !== classId
        );
        if (!newChanges.toRemove.includes(classId)) {
          newChanges.toRemove.push(classId);
        }
      }
      return newChanges;
    });
  };

  const handleHiddenToggle = (classId: string, currentIsHidden: boolean) => {
    const newIsHidden = !currentIsHidden;

    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isHidden: newIsHidden });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges = { ...prev };
      const original = initialState.get(classId);
      
      const pendingAdd = newChanges.toAdd.find((c) => c.classId === classId);
      if (pendingAdd) {
        pendingAdd.hidden = newIsHidden;
        return newChanges;
      }

      if (original?.isAssociated) {
        if (newIsHidden === original.isHidden) {
          newChanges.toUpdate = newChanges.toUpdate.filter(
            (c) => c.classId !== classId
          );
        } else {
          const existingUpdate = newChanges.toUpdate.find(
            (c) => c.classId === classId
          );
          if (existingUpdate) {
            existingUpdate.hidden = newIsHidden;
          } else {
            newChanges.toUpdate.push({ classId, hidden: newIsHidden });
          }
        }
      }
      return newChanges;
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setChanges(initialChanges);
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const promises = [
        ...changes.toAdd.map((c) =>
          apiPost(
            "/resources/association",
            {
              resourceId,
              classId: c.classId,
              hidden: c.hidden,
            },
            { parseResponse: "void" }
          )
        ),
        ...changes.toUpdate.map((c) =>
          apiPut(
            "/resources/association",
            {
              resourceId,
              classId: c.classId,
              hidden: c.hidden,
            } as ClassResource,
            { parseResponse: "void" }
          )
        ),
        ...changes.toRemove.map((classId) =>
          apiDelete<void>(`/resources/association/${resourceId}/${classId}`)
        ),
      ];
      await Promise.all(promises);
      onSuccess();
      handleClose();
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Error inesperado al guardar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges =
    changes.toAdd.length > 0 ||
    changes.toRemove.length > 0 ||
    changes.toUpdate.length > 0;

  const currentViewAssociations = useMemo(() => {
    return (
      data?.results.map(
        (assoc) => localAssociations.get(assoc.classId) || assoc
      ) || []
    );
  }, [data, localAssociations]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Recurso a Clases</DialogTitle>
      <DialogContent sx={{ p: 2, bgcolor: "background.default" }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {error && !isLoading && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {isLoading && !data ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : !data || data.results.length === 0 ? (
          <Alert severity="info">
            No tienes clases para asignar este recurso.
          </Alert>
        ) : (
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {currentViewAssociations.map((assoc, index) => (
              <div key={assoc.classId}>
                <ListItem dense sx={{ py: 1.5 }}>
                  <ListItemText
                    primary={assoc.className}
                    sx={{ flexGrow: 1 }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {assoc.isAssociated && (
                      <FormControlLabel
                        sx={{ mr: 0, color: "text.secondary" }}
                        control={
                          <Switch
                            checked={!assoc.isHidden} 
                            onChange={() =>
                              handleHiddenToggle(assoc.classId, assoc.isHidden)
                            }
                            disabled={isSubmitting}
                            size="small"
                          />
                        }
                        label="Visible"
                        labelPlacement="start"
                      />
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      color={assoc.isAssociated ? "error" : "primary"}
                      onClick={() =>
                        handleAssociationToggle(
                          assoc.classId,
                          assoc.isAssociated
                        )
                      }
                      disabled={isSubmitting}
                      sx={{ width: "90px" }}
                    >
                      {assoc.isAssociated ? "Quitar" : "Agregar"}
                    </Button>
                  </Box>
                </ListItem>
                {index < currentViewAssociations.length - 1 && (
                  <Divider component="li" />
                )}
              </div>
            ))}
          </List>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
          <PaginationControls
            data={data ?? undefined}
            setCriteria={setCriteria}
            lastPage={lastPage}
            firstPage={firstPage}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || isLoading || !hasChanges}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};