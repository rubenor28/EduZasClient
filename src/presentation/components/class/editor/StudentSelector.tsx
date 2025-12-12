import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type {
  PublicUserDTO,
  PaginatedQuery,
  UserCriteriaDTO,
} from "@application";
import { apiPost, apiDelete } from "@application";

/**
 * Props para el selector de estudiantes.
 */
type StudentSelectorProps = {
  /** ID de la clase. */
  classId: string;
  /** Indica si el usuario actual es el propietario de la clase. */
  isCurrentUserOwner: boolean;
  /** Controla si el modal está abierto para refrescar la lista. */
  open: boolean;
};

/**
 * Componente para ver y eliminar estudiantes de una clase.
 * Se muestra solo en modo edición y si el usuario actual es propietario o admin.
 */
export const StudentSelector = ({
  classId,
  isCurrentUserOwner,
  open,
}: StudentSelectorProps) => {
  const [students, setStudents] = useState<PublicUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!classId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiPost<
        PaginatedQuery<PublicUserDTO, UserCriteriaDTO>
      >(`/classes/${classId}/students`, { page: 1, pageSize: 100 }); // Se asume un máximo de 100 estudiantes, se podría añadir paginación.
      setStudents(result.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar estudiantes.");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (open && classId) {
      fetchStudents();
    }
  }, [open, classId, fetchStudents]);

  const handleRemoveStudent = async (studentId: number) => {
    try {
      await apiDelete(`/classes/enroll/${classId}/${studentId}`, {
        parseResponse: "void",
      });
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar estudiante.");
    }
  };

  // Solo los dueños de la clase (o admins, validados por `isCurrentUserOwner`) pueden gestionar estudiantes.
  if (!isCurrentUserOwner) {
    return null;
  }

  // No renderizar si no estamos en modo edición (no hay classId)
  if (!classId) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Gestionar Estudiantes
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <List>
          {students.length === 0 ? (
            <ListItem>
              <ListItemText primary="No hay estudiantes inscritos en esta clase." />
            </ListItem>
          ) : (
            students.map((student) => (
              <ListItem key={student.id} divider>
                <ListItemText
                  primary={`${student.firstName} ${student.lastName}`}
                  secondary={student.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveStudent(student.id)}
                    disabled={!isCurrentUserOwner}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};
