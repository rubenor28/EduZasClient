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
  ClassTestAssociation,
  ClassTestAssociationCriteria,
  ClassTestDTO,
} from "@application";
import { apiPost, apiDelete, apiPut } from "@application";
import { useUser, usePaginatedSearch, PaginationControls } from "@presentation";

/**
 * Estructura interna para rastrear cambios pendientes en las asociaciones de tests.
 */
type Changes = {
  /** Nuevas asociaciones a crear. */
  toAdd: Map<string, { visible: boolean }>;
  /** Asociaciones a eliminar. */
  toRemove: Set<string>;
  /** Asociaciones existentes a actualizar (ej. cambiar visibilidad). */
  toUpdate: Map<string, { visible: boolean }>;
};

const initialChanges: Changes = {
  toAdd: new Map(),
  toRemove: new Set(),
  toUpdate: new Map(),
};

/**
 * Modal para gestionar la asignación de una evaluación a múltiples clases.
 * Permite asociar, desasociar y cambiar la visibilidad de la evaluación en las clases
 * del profesor, enviando los cambios en un solo lote al guardar.
 */
export const TestClassAssociationManager = ({
  open,
  onClose,
  testId,
  onSuccess,
}: {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** ID del test que se está asignando. */
  testId: string;
  /** Callback tras guardar cambios exitosamente. */
  onSuccess: () => void;
}) => {
  const { user } = useUser();

  const [localAssociations, setLocalAssociations] = useState<
    Map<string, ClassTestAssociation>
  >(new Map());
  const [initialState, setInitialState] = useState<
    Map<string, ClassTestAssociation>
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
  } = usePaginatedSearch<ClassTestAssociation, ClassTestAssociationCriteria>(
    "/tests/assigned",
    {
      page: 1,
      pageSize: 8,
      professorId: user.id,
      testId: testId,
    },
    { autoFetch: open },
  );

  useEffect(() => {
    if (open) {
      refreshSearch();
    }
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
    currentIsAssociated: boolean,
  ) => {
    const wasOriginallyAssociated =
      initialState.get(classId)?.isAssociated ?? false;
    const newIsAssociated = !currentIsAssociated;

    // Actualiza el estado local para reflejar el cambio en la UI
    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isAssociated: newIsAssociated });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges = {
        toAdd: new Map(prev.toAdd),
        toRemove: new Set(prev.toRemove),
        toUpdate: new Map(prev.toUpdate),
      };

      // Se está ASOCIANDO una clase
      if (newIsAssociated) {
        // Si estaba en la lista de 'eliminar', es una reversión. La quitamos de 'toRemove'.
        if (newChanges.toRemove.has(classId)) {
          newChanges.toRemove.delete(classId);
        }
        // Si NO estaba asociada originalmente, la añadimos a 'toAdd'.
        else if (!wasOriginallyAssociated) {
          // La visibilidad por defecto al agregar es 'false' (oculto).
          newChanges.toAdd.set(classId, { visible: false });
        }
      }
      // Se está DESASOCIANDO una clase
      else {
        // Si estaba en la lista de 'agregar', es una reversión. La quitamos.
        if (newChanges.toAdd.has(classId)) {
          newChanges.toAdd.delete(classId);
        }
        // Si estaba asociada originalmente, la añadimos a 'toRemove'.
        // También la quitamos de 'toUpdate' si se había modificado su visibilidad.
        else if (wasOriginallyAssociated) {
          newChanges.toRemove.add(classId);
          if (newChanges.toUpdate.has(classId)) {
            newChanges.toUpdate.delete(classId);
          }
        }
      }
      return newChanges;
    });
  };

  const handleVisibilityToggle = (
    classId: string,
    currentIsVisible: boolean,
  ) => {
    const newIsVisible = !currentIsVisible;

    // Actualiza el estado local para la UI
    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isVisible: newIsVisible });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges = {
        toAdd: new Map(prev.toAdd),
        toRemove: new Set(prev.toRemove),
        toUpdate: new Map(prev.toUpdate),
      };

      const wasOriginallyAssociated = initialState.get(classId)?.isAssociated;
      const originalVisibility = initialState.get(classId)?.isVisible;

      // Caso 1: La asociación está pendiente de CREAR (`toAdd`).
      // Simplemente actualizamos su estado de visibilidad en `toAdd`.
      if (newChanges.toAdd.has(classId)) {
        newChanges.toAdd.set(classId, { visible: newIsVisible });
        return newChanges;
      }

      // Caso 2: La asociación YA EXISTÍA.
      if (wasOriginallyAssociated) {
        // Si la nueva visibilidad es la misma que la original, es una reversión.
        // La quitamos de la lista `toUpdate`.
        if (newIsVisible === originalVisibility) {
          if (newChanges.toUpdate.has(classId)) {
            newChanges.toUpdate.delete(classId);
          }
        }
        // Si la visibilidad es diferente a la original, la añadimos a `toUpdate`.
        else {
          newChanges.toUpdate.set(classId, { visible: newIsVisible });
        }
      }
      return newChanges;
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const promises: Promise<unknown>[] = [];

      // Añadir nuevas asociaciones
      changes.toAdd.forEach((value, classId) => {
        promises.push(
          apiPost<void>("/tests/classes", {
            testId,
            classId,
            visible: value.visible,
          } as ClassTestDTO),
        );
      });

      // Actualizar asociaciones existentes
      changes.toUpdate.forEach((value, classId) => {
        promises.push(
          apiPut<void>("/tests/classes", {
            testId,
            classId,
            visible: value.visible,
          } as ClassTestDTO),
        );
      });

      // Eliminar asociaciones
      changes.toRemove.forEach((classId) => {
        promises.push(apiDelete<void>(`/tests/${testId}/${classId}`));
      });

      await Promise.all(promises);
      onSuccess();
      handleClose();
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Error inesperado al guardar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges =
    changes.toAdd.size > 0 ||
    changes.toRemove.size > 0 ||
    changes.toUpdate.size > 0;

  const currentViewAssociations = useMemo(() => {
    return (
      data?.results.map(
        (assoc) => localAssociations.get(assoc.classId) || assoc,
      ) || []
    );
  }, [data, localAssociations]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Evaluación a Clases</DialogTitle>
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
            No tienes clases para asignar esta evaluación.
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
                            checked={assoc.isVisible}
                            onChange={() =>
                              handleVisibilityToggle(
                                assoc.classId,
                                assoc.isVisible,
                              )
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
                          assoc.isAssociated,
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