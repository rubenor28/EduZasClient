import type {
  ClassTestAssociation,
  ClassTestAssociationCriteria,
  Criteria,
} from "@application";
import { CircularProgress, Dialog, DialogTitle } from "@mui/material";
import { usePaginatedSearch, useUser } from "@presentation";
import { useEffect, useState } from "react";

type TestRelation = {
  classId: string;
  visible: boolean;
};

type Changes = {
  original: Map<string, TestRelation>;
  toAdd: Map<string, TestRelation>;
  toUpdate: Map<string, TestRelation>;
  toRemove: Map<string, TestRelation>;
};

type TestClassAssociationManagerProps = {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** ID del test que se está asignando. */
  testId: string;
  /** Callback tras guardar cambios exitosamente. */
  onSuccess: () => void;
};

const initialChanges: Changes = {
  original: new Map(),
  toAdd: new Map(),
  toRemove: new Map(),
  toUpdate: new Map(),
};

export function TestClassAssociationManager({
  open,
  testId,
  onSuccess,
  onClose,
}: TestClassAssociationManagerProps) {
  const { user } = useUser();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [{ original, toAdd, toRemove, toUpdate }, setChanges] =
    useState<Changes>(initialChanges);

  const initialCriteria: ClassTestAssociationCriteria = {
    page: 1,
    pageSize: 8,
    testId,
    professorId: user.id,
  };

  const { data, error, isLoading, refreshSearch, nextPage, prevPage } =
    usePaginatedSearch<ClassTestAssociation, ClassTestAssociationCriteria>(
      "/tests/assigned",
      initialCriteria,
    );

  // Si cambiamos de pagina nos aseguramos de tener información del estado original de las clases
  useEffect(() => {
    data?.results.forEach((c) => {
      if (!needsUpdate) return;

      original.set(c.classId, { classId: c.classId, visible: c.isVisible });
      setChanges((prev) => ({ ...prev, original }));
    });
  }, [data]);

  if (data === null) return <CircularProgress />;

  const classes = new Map(data.results.map((cs) => [cs.classId, cs]));

  useEffect(() => {
    refreshSearch();
    setChanges(initialChanges);
  }, [open]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleAssociationToggle = (cls: ClassTestAssociation) => {
    const { classId, isVisible } = cls;
    const wasOriginalAssociated = classes.has(cls.classId);
    const onToAdd = changes.toAdd.has(cls.classId);
    const onToRemove = changes.toRemove.has(cls.classId);

    const relation = { classId, visible: isVisible };
    if (wasOriginalAssociated) {
      const toRemove = changes.toRemove;
      toRemove.set(cls.classId, relation);
      setChanges((prev) => ({ ...prev, toRemove }));
    } else if (!wasOriginalAssociated) {
      const toAdd = changes.toAdd;
      toAdd.set(cls.classId, relation);
      setChanges((prev) => ({ ...prev, toAdd }));
    } else if (onToAdd) {
      const toAdd = changes.toAdd;
      toAdd.delete(cls.classId);
      setChanges((prev) => ({ ...prev, toAdd }));
    } else if (onToRemove) {
      const toRemove = changes.toRemove;
      toRemove.delete(cls.classId);
      setChanges((prev) => ({ ...prev, toRemove }));
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Recurso a Clases</DialogTitle>
    </Dialog>
  );
}
