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
  ClassTestAssociation,
  ClassTestAssociationCriteria,
} from "@application";
import { apiPost, apiDelete, apiPut } from "@application";
import { useUser, usePaginatedSearch, PaginationControls } from "@presentation";

type Changes = {
  toAdd: { classId: string; visible: boolean }[];
  toRemove: string[];
  toUpdate: { classId: string; visible: boolean }[];
};

const initialChanges: Changes = { toAdd: [], toRemove: [], toUpdate: [] };

/**
 * Props para el gestor de asignación de evaluaciones.
 */
type TestClassAssociationManagerProps = {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Callback tras guardar cambios exitosamente. */
  onSuccess: () => void;
  /** ID de la evaluación que se está asignando. */
  testId: string;
};

/**
 * Modal para gestionar la asignación de una evaluación a múltiples clases.
 * Similar a `ResourceClassAssociationManager`, pero para evaluaciones.
 *
 * Funcionalidades:
 * 1. Listar clases del profesor.
 * 2. Asignar/Desasignar evaluación a clases.
 * 3. Controlar la visibilidad de la evaluación para los alumnos.
 * 4. Guardado en lote de los cambios.
 */
export const TestClassAssociationManager = ({
  open,
  onClose,
  onSuccess,
  testId,
}: TestClassAssociationManagerProps) => {
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
    `/tests/assigned`,
    {
      page: 1,
      professorId: user.id,
      testId: testId,
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
            visible: true, // Visible por defecto
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

  const handleVisibilityToggle = (
    classId: string,
    currentIsVisible: boolean
  ) => {
    const newVisibility = !currentIsVisible;

    setLocalAssociations((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(classId)!;
      newMap.set(classId, { ...current, isVisible: newVisibility });
      return newMap;
    });

    setChanges((prev) => {
      const newChanges: Changes = { ...prev };
      const original = initialState.get(classId);

      const pendingAdd = newChanges.toAdd.find((c) => c.classId === classId);
      if (pendingAdd) {
        pendingAdd.visible = newVisibility;
        return newChanges;
      }

      if (original?.isAssociated) {
        if (newVisibility === original.isVisible) {
          newChanges.toUpdate = newChanges.toUpdate.filter(
            (c) => c.classId !== classId
          );
        } else {
          const existingUpdate = newChanges.toUpdate.find(
            (c) => c.classId === classId
          );
          if (existingUpdate) {
            existingUpdate.visible = newVisibility;
          } else {
            newChanges.toUpdate.push({ classId, visible: newVisibility });
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
            `/tests/classes`,
            { testId: testId, classId: c.classId, visible: c.visible },
            { parseResponse: "void" }
          )
        ),
        ...changes.toUpdate.map((c) =>
          apiPut(
            `/tests/classes`,
            { testId: testId, classId: c.classId, visible: c.visible },
            { parseResponse: "void" }
          )
        ),
        ...changes.toRemove.map((classId) =>
          apiDelete<void>(`/tests/${testId}/${classId}`)
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
            {currentViewAssociations.map((assoc) => (
              <ListItem key={assoc.classId} dense sx={{ py: 1.5 }}>
                <ListItemText primary={assoc.className} sx={{ flexGrow: 1 }} />
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
                              assoc.isVisible
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