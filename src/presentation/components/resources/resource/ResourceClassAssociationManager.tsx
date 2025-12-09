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
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import type {
  ClassResourceAssociation,
  ClassResourceAssociationCriteria,
} from "@application";
import { apiPost, apiDelete } from "@application";
import { useUser, usePaginatedSearch, PaginationControls } from "@presentation";

type Changes = {
  toAdd: { classId: string; isHidden: boolean }[];
  toRemove: string[];
};

const initialChanges: Changes = { toAdd: [], toRemove: [] };

type ResourceClassAssociationManagerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resourceId: string;
};

type LocalAssociation = ClassResourceAssociation & { isHidden: boolean };

export const ResourceClassAssociationManager = ({
  open,
  onClose,
  onSuccess,
  resourceId,
}: ResourceClassAssociationManagerProps) => {
  const { user } = useUser();

  const [localAssociations, setLocalAssociations] = useState<
    Map<string, LocalAssociation>
  >(new Map());
  const [initialState, setInitialState] = useState<
    Map<string, LocalAssociation>
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
    `/resources/assigned`,
    {
      page: 1,
      professorId: user.id,
      resourceId: resourceId,
    },
    { autoFetch: open }
  );

  useEffect(() => {
    if (open) {
      refreshSearch();
    }
  }, [open, refreshSearch]);

  useEffect(() => {
    if (open && data) {
      const initialMap = new Map(
        data.results.map((a) => [
          a.classId,
          { ...a, isHidden: (a as any).isHidden ?? false },
        ])
      );
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

    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isAssociated: !currentIsAssociated });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges: Changes = { ...prev };
      if (!currentIsAssociated) {
        // Toggling ON
        newChanges.toRemove = newChanges.toRemove.filter((id) => id !== classId);
        if (!wasOriginallyAssociated) {
          if (!newChanges.toAdd.find((c) => c.classId === classId)) {
            newChanges.toAdd.push({ classId, isHidden: false });
          }
        }
      } else {
        // Toggling OFF
        newChanges.toAdd = newChanges.toAdd.filter((c) => c.classId !== classId);
        if (wasOriginallyAssociated) {
          if (!newChanges.toRemove.includes(classId)) {
            newChanges.toRemove.push(classId);
          }
        }
      }
      return newChanges;
    });
  };

  const handleVisibilityToggle = (
    classId: string,
    currentIsHidden: boolean
  ) => {
    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isHidden: !currentIsHidden });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges: Changes = { ...prev };
      const pendingAdd = newChanges.toAdd.find((c) => c.classId === classId);
      if (pendingAdd) {
        pendingAdd.isHidden = !currentIsHidden;
      }
      return newChanges;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const promises = [
        ...changes.toAdd.map((c) =>
          apiPost(
            `/resources/association`,
            { resourceId: resourceId, classId: c.classId, isHidden: c.isHidden },
            { parseResponse: "void" }
          )
        ),
        ...changes.toRemove.map((classId) =>
          apiDelete<void>(`/resources/association/${resourceId}/${classId}`)
        ),
      ];
      await Promise.all(promises);
      onSuccess();
      onClose();
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Error inesperado al guardar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => !isSubmitting && onClose();
  const hasChanges = changes.toAdd.length > 0 || changes.toRemove.length > 0;

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
            {currentViewAssociations.map((assoc) => {
              const isOriginallyAssociated =
                initialState.get(assoc.classId)?.isAssociated ?? false;

              return (
                <ListItem key={assoc.classId} dense sx={{ py: 1.5 }}>
                  <ListItemText primary={assoc.className} sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {assoc.isAssociated && (
                      <FormControlLabel
                        sx={{ mr: 0, color: "text.secondary" }}
                        control={
                          <Switch
                            checked={assoc.isHidden}
                            onChange={() =>
                              handleVisibilityToggle(assoc.classId, assoc.isHidden)
                            }
                            disabled={isSubmitting || isOriginallyAssociated}
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
                      color={assoc.isAssociated ? "error" : "primary"}
                      onClick={() =>
                        handleAssociationToggle(assoc.classId, assoc.isAssociated)
                      }
                      disabled={isSubmitting}
                      sx={{ width: "90px" }}
                    >
                      {assoc.isAssociated ? "Quitar" : "Agregar"}
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
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
