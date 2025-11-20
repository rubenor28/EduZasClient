import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "@presentation";
import {
  apiPost,
  NotFoundError,
  AlreadyExistError,
  InputError,
} from "@application";

type EnrollClassModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback para refrescar la lista
};

export const EnrollClassModal = ({
  open,
  onClose,
  onSuccess,
}: EnrollClassModalProps) => {
  const { user } = useUser();
  const [classId, setClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!classId) {
      setError("El código de la clase no puede estar vacío.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { classId, userId: user.id };
            await apiPost("/classes/enroll", payload);
      onSuccess();
      onClose();
    } catch (e) {
      if (e instanceof NotFoundError) {
        setError("No se encontró ninguna clase con ese código.");
      } else if (e instanceof AlreadyExistError) {
        setError("Ya estás inscrito en esta clase.");
      } else if (e instanceof InputError) {
        // Asumiendo que el error de input es para el campo classId
        setError(e.errors[0]?.message || "El código de la clase es inválido.");
      } else {
        setError(
          e instanceof Error ? e.message : "Ocurrió un error inesperado.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpia el estado cuando el modal se cierra
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setClassId("");
      setError(null);
    }, 300); // Pequeño delay para evitar que el contenido desaparezca bruscamente
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Inscribirse a una Clase</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="classId"
          label="Código de la Clase"
          type="text"
          fullWidth
          variant="outlined"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Inscribirse"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
